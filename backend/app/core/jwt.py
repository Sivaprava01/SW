import secrets
import hashlib
import logging
from datetime import datetime, timedelta, timezone
from typing import Optional, Dict, Any, Tuple
import jwt
from sqlalchemy.orm import Session
from app.config import settings
from app.models.refresh_token import RefreshToken

logger = logging.getLogger("sakhi.security")

def _hash_token(raw_token: str) -> str:
    """Computes SHA-256 hash of a raw token for secure database storage."""
    return hashlib.sha256(raw_token.encode("utf-8")).hexdigest()

def create_access_token(
    user_id: str,
    role: str = "USER",
    expires_delta: Optional[timedelta] = None
) -> str:
    """
    Generates a signed JWT access token containing ONLY standard identity claims:
    sub (user ID), role, iat, exp.
    NO passwords, financial data, or sensitive personal metrics are included.
    """
    now = datetime.now(timezone.utc)
    if expires_delta:
        expire = now + expires_delta
    else:
        expire = now + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)

    payload: Dict[str, Any] = {
        "sub": str(user_id),
        "role": role,
        "jti": secrets.token_hex(8),
        "iat": int(now.timestamp()),
        "exp": int(expire.timestamp())
    }

    encoded_jwt = jwt.encode(
        payload,
        settings.JWT_SECRET,
        algorithm=settings.JWT_ALGORITHM
    )
    return encoded_jwt

def decode_access_token(token: str) -> Dict[str, Any]:
    """
    Validates signature and expiration of an access token, returning the payload.
    Raises jwt.ExpiredSignatureError or jwt.InvalidTokenError on failure.
    """
    return jwt.decode(
        token,
        settings.JWT_SECRET,
        algorithms=[settings.JWT_ALGORITHM]
    )

def create_refresh_token(
    db: Session,
    user_id: str,
    user_agent: Optional[str] = None,
    ip_address: Optional[str] = None
) -> str:
    """
    Creates a secure high-entropy refresh token, persists its SHA-256 hash in the database,
    and returns the raw token to the client.
    """
    raw_token = secrets.token_urlsafe(64)
    token_hash = _hash_token(raw_token)
    expires_at = datetime.utcnow() + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)

    session_record = RefreshToken(
        user_id=user_id,
        token_hash=token_hash,
        expires_at=expires_at,
        revoked=False,
        user_agent=user_agent[:255] if user_agent else None,
        ip_address=ip_address[:45] if ip_address else None
    )
    db.add(session_record)
    db.commit()
    db.refresh(session_record)
    return raw_token

def validate_refresh_token(db: Session, raw_token: str) -> RefreshToken:
    """
    Validates a raw refresh token against database records.
    Ensures the token exists, is not revoked, and has not expired.
    Raises ValueError on invalid or expired token.
    """
    token_hash = _hash_token(raw_token)
    token_record = db.query(RefreshToken).filter(RefreshToken.token_hash == token_hash).first()

    if not token_record:
        logger.warning("Refresh token verification failed: token not found in store.")
        raise ValueError("Invalid refresh token")

    if token_record.revoked:
        logger.warning(f"Refresh token verification failed: token already revoked for user {token_record.user_id}.")
        raise ValueError("Refresh token has been revoked")

    if token_record.expires_at < datetime.utcnow():
        logger.warning(f"Refresh token verification failed: token expired at {token_record.expires_at}.")
        raise ValueError("Refresh token has expired")

    return token_record

def rotate_refresh_token(
    db: Session,
    raw_token: str,
    user_agent: Optional[str] = None,
    ip_address: Optional[str] = None
) -> Tuple[str, RefreshToken]:
    """
    Implements single-use refresh token rotation:
    1. Validates current refresh token.
    2. Marks it revoked.
    3. Issues and persists a brand-new refresh token.
    """
    token_record = validate_refresh_token(db, raw_token)
    token_record.revoked = True
    token_record.revoked_at = datetime.utcnow()
    db.commit()

    new_raw_token = create_refresh_token(
        db=db,
        user_id=token_record.user_id,
        user_agent=user_agent,
        ip_address=ip_address
    )
    return new_raw_token, token_record

def revoke_refresh_token(db: Session, raw_token: str) -> bool:
    """
    Explicitly revokes a refresh token upon logout.
    """
    token_hash = _hash_token(raw_token)
    token_record = db.query(RefreshToken).filter(RefreshToken.token_hash == token_hash).first()
    if token_record and not token_record.revoked:
        token_record.revoked = True
        token_record.revoked_at = datetime.utcnow()
        db.commit()
        return True
    return False

def revoke_all_user_tokens(db: Session, user_id: str) -> int:
    """
    Revokes all active sessions/refresh tokens for a user (e.g. security reset).
    """
    active_tokens = db.query(RefreshToken).filter(
        RefreshToken.user_id == user_id,
        RefreshToken.revoked == False
    ).all()
    count = 0
    now = datetime.utcnow()
    for t in active_tokens:
        t.revoked = True
        t.revoked_at = now
        count += 1
    db.commit()
    return count
