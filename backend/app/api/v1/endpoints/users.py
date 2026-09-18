"""
Sakhi User API Endpoints.

Handles user registration, profile retrieval, updates, and demo Lakshmi access.
"""

from typing import List, Optional
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.api.deps import get_optional_user, verify_user_access
from app.models.user import User
from app.core.errors import ResourceNotFoundException
from app.schemas.user import UserCreate, UserUpdate, UserResponse
from app.services.user_service import UserService

router = APIRouter(prefix="/users", tags=["Users & Personalization"])


@router.post(
    "",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create User Profile",
    description="Onboard a new user with demographic, language, and baseline financial data."
)
def create_user(
    user_in: UserCreate,
    db: Session = Depends(get_db)
) -> UserResponse:
    """Create a new user profile."""
    return UserService.create_user(db=db, user_in=user_in)


@router.get(
    "/demo/lakshmi",
    response_model=UserResponse,
    summary="Get or Initialize Demo Profile (Lakshmi)",
    description="Fetches or creates the standardized reference Lakshmi demo profile for instant evaluation."
)
def get_demo_user(
    db: Session = Depends(get_db)
) -> UserResponse:
    """Retrieve or initialize the official Lakshmi demo profile."""
    return UserService.get_or_create_demo_user(db=db)


@router.get(
    "/{user_id}",
    response_model=UserResponse,
    summary="Get User Profile",
    description="Retrieve a user profile by unique user ID."
)
def get_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_user),
) -> UserResponse:
    """Retrieve user profile by ID."""
    verify_user_access(user_id, current_user)
    user = UserService.get_user_by_id(db=db, user_id=user_id)
    if not user:
        raise ResourceNotFoundException(message=f"User with ID {user_id} not found")
    return user


@router.patch(
    "/{user_id}",
    response_model=UserResponse,
    summary="Update User Profile",
    description="Partially update user demographics, language, SHG attributes, or baseline finances."
)
def update_user(
    user_id: int,
    user_in: UserUpdate,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_user),
) -> UserResponse:
    """Update user profile by ID."""
    verify_user_access(user_id, current_user)
    user = UserService.get_user_by_id(db=db, user_id=user_id)
    if not user:
        raise ResourceNotFoundException(message=f"User with ID {user_id} not found")
    return UserService.update_user(db=db, user=user, user_in=user_in)


@router.delete(
    "/{user_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete User Profile",
    description="Delete a user profile and associated data."
)
def delete_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_user),
) -> None:
    """Delete a user by ID."""
    verify_user_access(user_id, current_user)
    user = UserService.get_user_by_id(db=db, user_id=user_id)
    if not user:
        raise ResourceNotFoundException(message=f"User with ID {user_id} not found")
    UserService.delete_user(db=db, user=user)


@router.get(
    "",
    response_model=List[UserResponse],
    summary="List Users",
    description="Retrieve a list of user profiles with pagination."
)
def list_users(
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=50, ge=1, le=100),
    db: Session = Depends(get_db)
) -> List[UserResponse]:
    """List users with pagination."""
    return UserService.list_users(db=db, skip=skip, limit=limit)
