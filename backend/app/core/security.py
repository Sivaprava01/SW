"""
Sakhi Core Security & Cryptography Module.

Provides robust password hashing (bcrypt) and signed JSON Web Token (JWT)
issuance, verification, and claim extraction.
"""

from datetime import datetime, timedelta, timezone
from typing import Any, Dict, Optional, Union
import bcrypt
import jwt
from app.core.config import settings
from app.core.errors import AuthenticationException


def hash_password(password: str) -> str:
    """
    Hash a plaintext password using bcrypt with a secure per-password salt.
    """
    if not password:
        raise ValueError("Password cannot be empty")
    # Truncate to 72 bytes if necessary per bcrypt specification
    pwd_bytes = password.encode("utf-8")[:72]
    salt = bcrypt.gensalt(rounds=12)
    hashed = bcrypt.hashpw(pwd_bytes, salt)
    return hashed.decode("utf-8")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verify a plaintext password against a stored bcrypt hash.
    Constant-time comparison prevents timing attacks.
    """
    if not plain_password or not hashed_password:
        return False
    try:
        pwd_bytes = plain_password.encode("utf-8")[:72]
        hash_bytes = hashed_password.encode("utf-8")
        return bcrypt.checkpw(pwd_bytes, hash_bytes)
    except Exception:
        return False


def _get_jwt_secret() -> str:
    """
    Retrieve the configured JWT secret key or fall back to application SECRET_KEY.
    """
    key = settings.JWT_SECRET_KEY.strip() if settings.JWT_SECRET_KEY else ""
    if not key:
        key = settings.SECRET_KEY.strip() if settings.SECRET_KEY else "sakhi-fallback-dev-secret-key-32-chars-long"
    return key


def create_access_token(
    user_id: Union[int, str],
    expires_delta: Optional[timedelta] = None,
    extra_claims: Optional[Dict[str, Any]] = None,
) -> str:
    """
    Create a signed JWT access token containing standard claims (sub, iat, exp, type).
    """
    now = datetime.now(timezone.utc)
    if expires_delta:
        expire = now + expires_delta
    else:
        expire = now + timedelta(minutes=settings.JWT_ACCESS_TOKEN_EXPIRE_MINUTES)

    payload: Dict[str, Any] = {
        "sub": str(user_id),
        "iat": int(now.timestamp()),
        "exp": int(expire.timestamp()),
        "type": "access",
    }

    if extra_claims:
        payload.update(extra_claims)

    secret = _get_jwt_secret()
    token = jwt.encode(payload, secret, algorithm=settings.JWT_ALGORITHM)
    return token


def create_refresh_token(
    user_id: Union[int, str],
    expires_delta: Optional[timedelta] = None,
) -> str:
    """
    Create a signed JWT refresh token for extended session renewal.
    """
    now = datetime.now(timezone.utc)
    if expires_delta:
        expire = now + expires_delta
    else:
        expire = now + timedelta(minutes=settings.JWT_REFRESH_TOKEN_EXPIRE_MINUTES)

    payload: Dict[str, Any] = {
        "sub": str(user_id),
        "iat": int(now.timestamp()),
        "exp": int(expire.timestamp()),
        "type": "refresh",
    }

    secret = _get_jwt_secret()
    token = jwt.encode(payload, secret, algorithm=settings.JWT_ALGORITHM)
    return token


def decode_token(token: str) -> Dict[str, Any]:
    """
    Decode and validate a signed JWT token.
    Raises AuthenticationException on signature failure, expiration, or invalid format.
    """
    if not token:
        raise AuthenticationException(message="Authentication token is required")

    secret = _get_jwt_secret()
    try:
        payload = jwt.decode(
            token,
            secret,
            algorithms=[settings.JWT_ALGORITHM],
            options={"require": ["sub", "exp", "iat"]},
        )
        return payload
    except jwt.ExpiredSignatureError:
        raise AuthenticationException(message="Authentication token has expired. Please sign in again.")
    except jwt.InvalidTokenError as exc:
        raise AuthenticationException(message=f"Invalid authentication token: {str(exc)}")
