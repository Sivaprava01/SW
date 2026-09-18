import logging
from typing import List, Union, Callable
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
import jwt
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.core.jwt import decode_access_token

logger = logging.getLogger("sakhi.security")

# OAuth2 bearer token scheme (tokenUrl points to our login endpoint)
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login", auto_error=False)

async def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
) -> User:
    """
    Decodes and validates JWT access token from Authorization header.
    Returns the authenticated active User object.
    Raises 401 Unauthorized if missing, expired, invalid, or user inactive.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    if not token:
        logger.warning("Authentication failed: No bearer token provided.")
        raise credentials_exception

    try:
        payload = decode_access_token(token)
        user_id: str = payload.get("sub")
        if not user_id:
            logger.warning("Authentication failed: 'sub' missing from token payload.")
            raise credentials_exception
    except jwt.ExpiredSignatureError:
        logger.info("Authentication failed: Access token has expired.")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired. Please refresh your token or login again.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except jwt.InvalidTokenError as e:
        logger.warning(f"Authentication failed: Invalid token ({e}).")
        raise credentials_exception

    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        logger.warning(f"Authentication failed: User ID {user_id} in token not found in database.")
        raise credentials_exception

    if not user.is_active:
        logger.warning(f"Authentication failed: User {user_id} is inactive.")
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is inactive"
        )

    return user

require_authenticated_user = get_current_user

def require_role(required_roles: Union[str, List[str]]) -> Callable:
    """
    Factory creating a dependency that verifies the authenticated user possesses one of the required roles.
    Raises 403 Forbidden if unauthorized.
    """
    if isinstance(required_roles, str):
        allowed = [required_roles]
    else:
        allowed = list(required_roles)

    async def role_checker(current_user: User = Depends(get_current_user)) -> User:
        if current_user.role not in allowed:
            logger.warning(
                f"Authorization failure: User {current_user.id} with role '{current_user.role}' "
                f"attempted to access endpoint requiring {allowed}."
            )
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Operation not permitted. Required role: {', '.join(allowed)}"
            )
        return current_user

    return role_checker

def check_resource_owner(resource_user_id: str, current_user: User) -> bool:
    """
    Checks if current_user owns the requested resource or has ADMIN privileges.
    Raises 403 Forbidden if not authorized.
    """
    if current_user.id == resource_user_id or current_user.role == "ADMIN":
        return True

    logger.warning(
        f"Authorization failure: User {current_user.id} tried to access resource of {resource_user_id}."
    )
    raise HTTPException(
        status_code=status.HTTP_403_FORBIDDEN,
        detail="You do not have permission to access or modify this resource"
    )
