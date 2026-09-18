"""
Sakhi Authentication API Endpoints.

Provides registration, login credential verification, current user retrieval,
token renewal, and logout endpoints.
"""

from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.api.deps import get_current_user, get_optional_user
from app.models.user import User
from app.schemas.auth import (
    RegisterRequest,
    LoginRequest,
    TokenResponse,
    RefreshTokenRequest,
    RefreshTokenResponse,
    LogoutResponse,
)
from app.schemas.user import UserResponse
from app.services.auth_service import AuthService

router = APIRouter(prefix="/auth", tags=["Authentication & Access"])


@router.post(
    "/register",
    response_model=TokenResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Register New Member",
    description="Register a new member with credentials and receive a signed JWT session token."
)
def register(
    reg_in: RegisterRequest,
    db: Session = Depends(get_db),
) -> TokenResponse:
    """Create a new member account and issue an authenticated JWT token."""
    token_resp, _ = AuthService.register_user(db=db, reg_in=reg_in)
    return token_resp


@router.post(
    "/login",
    response_model=TokenResponse,
    status_code=status.HTTP_200_OK,
    summary="Member Sign In",
    description="Authenticate with 10-digit mobile number and password to obtain a signed JWT session token."
)
def login(
    login_in: LoginRequest,
    db: Session = Depends(get_db),
) -> TokenResponse:
    """Verify credentials and issue JWT access token."""
    return AuthService.login_user(db=db, login_in=login_in)


@router.get(
    "/me",
    response_model=UserResponse,
    status_code=status.HTTP_200_OK,
    summary="Get Current Authenticated Member Profile",
    description="Validate JWT bearer token and retrieve current member demographics."
)
def get_me(
    current_user: User = Depends(get_current_user),
) -> UserResponse:
    """Return the profile of the currently authenticated member."""
    return UserResponse.model_validate(current_user)


@router.post(
    "/refresh",
    response_model=RefreshTokenResponse,
    status_code=status.HTTP_200_OK,
    summary="Refresh Access Token",
    description="Exchange a valid refresh token for a new short-lived access token."
)
def refresh_token(
    refresh_in: RefreshTokenRequest,
    db: Session = Depends(get_db),
) -> RefreshTokenResponse:
    """Renew access token using refresh token."""
    return AuthService.refresh_access_token(db=db, refresh_token=refresh_in.refresh_token)


@router.post(
    "/logout",
    response_model=LogoutResponse,
    status_code=status.HTTP_200_OK,
    summary="Member Sign Out",
    description="End current authenticated session."
)
def logout(
    _current_user: User = Depends(get_optional_user),
) -> LogoutResponse:
    """Acknowledge session termination and logout."""
    return LogoutResponse(message="Logged out successfully")
