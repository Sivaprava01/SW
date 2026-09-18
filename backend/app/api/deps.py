"""
Sakhi FastAPI Dependency Injection Helpers.

Provides authentication and authorization dependencies for securing
endpoints, extracting the current authenticated user, and preventing cross-user data leakage.
"""

from typing import Optional
from fastapi import Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import decode_token
from app.core.errors import AuthenticationException, AuthorizationException
from app.models.user import User

# HTTP Bearer authentication scheme handler
http_bearer = HTTPBearer(auto_error=False)


def get_current_user(
    auth: Optional[HTTPAuthorizationCredentials] = Depends(http_bearer),
    db: Session = Depends(get_db),
) -> User:
    """
    FastAPI dependency that validates the JWT access token in the Authorization header
    and returns the corresponding User database model.
    Raises AuthenticationException (HTTP 401) on missing or invalid token.
    """
    if not auth or not auth.credentials:
        raise AuthenticationException(message="Authentication token is required. Please sign in.")

    payload = decode_token(auth.credentials)
    token_type = payload.get("type")
    if token_type and token_type != "access":
        raise AuthenticationException(message="Invalid token type. Expected access token.")

    user_id_str = payload.get("sub")
    if not user_id_str:
        raise AuthenticationException(message="Token does not contain a valid user identity claim.")

    try:
        user_id = int(user_id_str)
    except ValueError:
        raise AuthenticationException(message="Invalid user identifier format in token.")

    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise AuthenticationException(message="User account associated with this token was not found.")

    return user


def get_optional_user(
    auth: Optional[HTTPAuthorizationCredentials] = Depends(http_bearer),
    db: Session = Depends(get_db),
) -> Optional[User]:
    """
    FastAPI dependency for endpoints that accept either authenticated or guest requests.
    Returns User if a valid token is provided, None otherwise.
    """
    if not auth or not auth.credentials:
        return None

    try:
        payload = decode_token(auth.credentials)
        if payload.get("type") not in (None, "access"):
            return None
        user_id_str = payload.get("sub")
        if not user_id_str:
            return None
        user_id = int(user_id_str)
        return db.query(User).filter(User.id == user_id).first()
    except Exception:
        return None


def verify_user_access(requested_user_id: int, current_user: Optional[User]) -> None:
    """
    Enforces authorization boundaries: verifies that the authenticated user
    is only accessing their own financial resources.
    Raises AuthorizationException (HTTP 403 Forbidden) if a user attempts
    to access another member's data.
    """
    if current_user is not None and current_user.id != requested_user_id:
        raise AuthorizationException(
            message=f"Access forbidden: You do not have permission to access financial records for user ID {requested_user_id}."
        )
