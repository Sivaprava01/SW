"""
Sakhi Authentication Service Module.

Encapsulates user registration with salted bcrypt password hashing,
credential verification with constant-time comparison, JWT generation,
and token refresh mechanisms.
"""

from typing import Tuple
from sqlalchemy.orm import Session
from app.core.config import settings
from app.core.security import (
    hash_password,
    verify_password,
    create_access_token,
    create_refresh_token,
    decode_token,
)
from app.core.errors import AuthenticationException, DuplicateResourceException
from app.core.logging import logger
from app.models.user import User
from app.schemas.auth import (
    RegisterRequest,
    LoginRequest,
    TokenResponse,
    RefreshTokenResponse,
)
from app.schemas.user import UserResponse
from app.services.user_service import UserService


class AuthService:
    """Service handling credential verification, JWT issuance, and registration."""

    @staticmethod
    def register_user(db: Session, reg_in: RegisterRequest) -> Tuple[TokenResponse, User]:
        """
        Register a new member with secure password hashing and return signed JWT.
        Prevents duplicate mobile registrations.
        """
        phone = reg_in.get_phone()
        if phone:
            existing = UserService.get_user_by_phone(db=db, phone_number=phone)
            if existing:
                raise DuplicateResourceException(
                    message="An account with this mobile number already exists. Please sign in."
                )

        hashed = hash_password(reg_in.password)

        new_user = User(
            name=reg_in.name.strip(),
            phone_number=phone if phone else None,
            hashed_password=hashed,
            age=reg_in.age,
            gender=reg_in.gender,
            state=reg_in.state,
            district=reg_in.district,
            locality_type=reg_in.locality_type,
            primary_language=reg_in.primary_language,
            is_shg_member=reg_in.is_shg_member,
            shg_name=reg_in.shg_name,
            occupation=reg_in.occupation,
            monthly_income=reg_in.monthly_income,
            monthly_expenses=reg_in.monthly_expenses,
            initial_savings=reg_in.initial_savings,
            initial_debt=reg_in.initial_debt,
        )

        db.add(new_user)
        db.commit()
        db.refresh(new_user)

        logger.info(f"Registered new member id={new_user.id} name='{new_user.name}' phone='{phone}'")

        access_token = create_access_token(user_id=new_user.id)
        refresh_token = create_refresh_token(user_id=new_user.id)
        expires_in = settings.JWT_ACCESS_TOKEN_EXPIRE_MINUTES * 60

        token_response = TokenResponse(
            access_token=access_token,
            refresh_token=refresh_token,
            token_type="bearer",
            expires_in=expires_in,
            user=UserResponse.model_validate(new_user),
        )

        return token_response, new_user

    @staticmethod
    def login_user(db: Session, login_in: LoginRequest) -> TokenResponse:
        """
        Authenticate a member using their mobile number and password.
        Returns generic error on failure to prevent account enumeration.
        """
        phone = login_in.get_phone()
        if not phone:
            raise AuthenticationException(message="Invalid mobile number or password.")

        user = UserService.get_user_by_phone(db=db, phone_number=phone)
        if not user or not user.hashed_password:
            # Constant-time delay simulation against timing attacks
            verify_password("dummy-password", "$2b$12$e8uq4fC2vK9v/6L6K6K6K.e8uq4fC2vK9v/6L6K6K6K.e8uq4fC2v")
            raise AuthenticationException(message="Invalid mobile number or password.")

        if not verify_password(login_in.password, user.hashed_password):
            raise AuthenticationException(message="Invalid mobile number or password.")

        logger.info(f"Member authenticated successfully: id={user.id} name='{user.name}'")

        access_token = create_access_token(user_id=user.id)
        refresh_token = create_refresh_token(user_id=user.id)
        expires_in = settings.JWT_ACCESS_TOKEN_EXPIRE_MINUTES * 60

        return TokenResponse(
            access_token=access_token,
            refresh_token=refresh_token,
            token_type="bearer",
            expires_in=expires_in,
            user=UserResponse.model_validate(user),
        )

    @staticmethod
    def refresh_access_token(db: Session, refresh_token: str) -> RefreshTokenResponse:
        """
        Validate a refresh token and issue a new short-lived access token.
        """
        payload = decode_token(refresh_token)
        token_type = payload.get("type")
        if token_type != "refresh":
            raise AuthenticationException(message="Invalid token type. Expected refresh token.")

        user_id_str = payload.get("sub")
        if not user_id_str:
            raise AuthenticationException(message="Invalid refresh token claims.")

        try:
            user_id = int(user_id_str)
        except ValueError:
            raise AuthenticationException(message="Invalid user identifier format.")

        user = UserService.get_user_by_id(db=db, user_id=user_id)
        if not user:
            raise AuthenticationException(message="User account associated with this token was not found.")

        new_access_token = create_access_token(user_id=user.id)
        expires_in = settings.JWT_ACCESS_TOKEN_EXPIRE_MINUTES * 60

        return RefreshTokenResponse(
            access_token=new_access_token,
            token_type="bearer",
            expires_in=expires_in,
        )
