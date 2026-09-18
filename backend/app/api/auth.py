import logging
from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session
from sqlalchemy import or_

from app.config import settings
from app.database import get_db
from app.models.user import User
from app.models.goal import Goal
from app.schemas.auth import (
    RegisterRequest,
    LoginRequest,
    RefreshRequest,
    TokenResponse,
    TokenRefreshResponse,
    LogoutRequest,
    MessageResponse
)
from app.schemas.user import UserResponse
from app.core.security import hash_password, verify_password
from app.core.jwt import (
    create_access_token,
    create_refresh_token,
    rotate_refresh_token,
    revoke_refresh_token
)
from app.core.rate_limiter import RateLimit, get_client_ip
from app.api.deps import get_current_user

logger = logging.getLogger("sakhi.security")

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

@router.post(
    "/register",
    response_model=TokenResponse,
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(RateLimit(settings.REGISTER_RATE_LIMIT, 60, "reg"))]
)
def register(
    req: RegisterRequest,
    request: Request,
    db: Session = Depends(get_db)
):
    """
    Registers a new user account with hashed password and returns access + refresh tokens.
    Prevents duplicate emails and phone numbers (HTTP 409).
    """
    # 1. Check for duplicate email
    if req.email:
        existing_email = db.query(User).filter(User.email == req.email.strip().lower()).first()
        if existing_email:
            logger.warning(f"Registration conflict: email already registered.")
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="An account with this email address already exists."
            )

    # 2. Check for duplicate phone
    if req.phone:
        existing_phone = db.query(User).filter(User.phone == req.phone.strip()).first()
        if existing_phone:
            logger.warning(f"Registration conflict: phone already registered.")
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="An account with this phone number already exists."
            )

    # 3. Hash password securely with bcrypt
    hashed = hash_password(req.password)

    # 4. Create User entity
    user = User(
        name=req.name.strip(),
        email=req.email.strip().lower() if req.email else None,
        phone=req.phone.strip() if req.phone else None,
        password_hash=hashed,
        role="USER",
        is_active=True,
        age=req.age,
        state=req.state,
        gender=req.gender,
        is_shg_member=req.is_shg_member,
        has_business_interest=req.has_business_interest,
        is_rural=req.is_rural,
        occupation=req.occupation,
        monthly_income=req.monthly_income,
        monthly_expenses=req.monthly_expenses,
        savings=req.savings,
        debt=req.debt,
        financial_goal=req.financial_goal
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    # If an initial goal was declared, seed it
    if req.financial_goal:
        target_amount = 50000.0
        goal = Goal(
            user_id=user.id,
            name=req.financial_goal,
            category="Education" if "educat" in req.financial_goal.lower() else "Personal",
            target_amount=target_amount,
            current_amount=min(req.savings, 10000.0),
            target_date="12"
        )
        db.add(goal)
        db.commit()

    # 5. Issue access token and refresh token
    ip = get_client_ip(request)
    user_agent = request.headers.get("User-Agent")

    access_token = create_access_token(user_id=user.id, role=user.role)
    refresh_token = create_refresh_token(db=db, user_id=user.id, user_agent=user_agent, ip_address=ip)

    logger.info(f"Security Event: User registered successfully (ID: {user.id})")

    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        token_type="bearer",
        expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        user=user
    )

@router.post(
    "/login",
    response_model=TokenResponse,
    dependencies=[Depends(RateLimit(settings.LOGIN_RATE_LIMIT, 60, "login"))]
)
def login(
    req: LoginRequest,
    request: Request,
    db: Session = Depends(get_db)
):
    """
    Authenticates user with email or phone + password.
    Issues fresh access and refresh tokens upon successful verification.
    """
    identifier = req.identifier.strip().lower()
    
    # Lookup by email or phone
    user = db.query(User).filter(
        or_(User.email == identifier, User.phone == req.identifier.strip())
    ).first()

    if not user or not user.password_hash or not verify_password(req.password, user.password_hash):
        logger.warning(f"Security Event: Failed login attempt for identifier identifier")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email/phone or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if not user.is_active:
        logger.warning(f"Security Event: Login attempted for inactive account {user.id}")
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is inactive"
        )

    ip = get_client_ip(request)
    user_agent = request.headers.get("User-Agent")

    access_token = create_access_token(user_id=user.id, role=user.role)
    refresh_token = create_refresh_token(db=db, user_id=user.id, user_agent=user_agent, ip_address=ip)

    logger.info(f"Security Event: Successful login for user {user.id}")

    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        token_type="bearer",
        expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        user=user
    )

@router.post(
    "/refresh",
    response_model=TokenRefreshResponse,
    dependencies=[Depends(RateLimit(settings.REFRESH_RATE_LIMIT, 60, "refresh"))]
)
def refresh(
    req: RefreshRequest,
    request: Request,
    db: Session = Depends(get_db)
):
    """
    Validates the supplied refresh token, rotates it (revoking old, issuing new),
    and returns a fresh access token.
    """
    ip = get_client_ip(request)
    user_agent = request.headers.get("User-Agent")

    try:
        new_refresh_token, old_session = rotate_refresh_token(
            db=db,
            raw_token=req.refresh_token,
            user_agent=user_agent,
            ip_address=ip
        )
    except ValueError as e:
        logger.warning(f"Security Event: Token refresh failed: {e}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(e),
            headers={"WWW-Authenticate": "Bearer"},
        )

    user = db.query(User).filter(User.id == old_session.user_id).first()
    if not user or not user.is_active:
        logger.warning("Security Event: Token refresh attempted for non-existent or inactive user.")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User no longer active",
            headers={"WWW-Authenticate": "Bearer"},
        )

    new_access_token = create_access_token(user_id=user.id, role=user.role)
    logger.info(f"Security Event: Rotated refresh token and reissued access token for user {user.id}")

    return TokenRefreshResponse(
        access_token=new_access_token,
        refresh_token=new_refresh_token,
        token_type="bearer",
        expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60
    )

@router.post("/logout", response_model=MessageResponse)
def logout(
    req: LogoutRequest,
    db: Session = Depends(get_db)
):
    """
    Revokes the provided refresh token to invalidate the session.
    """
    if req.refresh_token:
        revoked = revoke_refresh_token(db=db, raw_token=req.refresh_token)
        if revoked:
            logger.info("Security Event: Refresh token successfully revoked on logout.")
        else:
            logger.info("Security Event: Logout called with already revoked or invalid token.")

    return MessageResponse(message="Logged out successfully")

@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    """
    Returns the authenticated user's profile information.
    Password hash and secret credentials are automatically excluded.
    """
    return current_user
