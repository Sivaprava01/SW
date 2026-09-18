"""
Sakhi Goal API Endpoints.

Handles goal creation, progress tracking, deposits, updates, and deletion.
"""

from typing import List
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.errors import ResourceNotFoundException
from app.schemas.goal import GoalCreate, GoalUpdate, GoalDepositRequest, GoalResponse
from app.services.user_service import UserService
from app.services.goal_service import GoalService

router = APIRouter(tags=["Goals & Savings Planning"])


@router.post(
    "/users/{user_id}/goals",
    response_model=GoalResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create Savings Goal",
    description="Set a target savings goal with time horizon and deterministic monthly savings requirements."
)
def create_goal(
    user_id: int,
    goal_in: GoalCreate,
    db: Session = Depends(get_db)
) -> GoalResponse:
    """Create a savings goal for a user."""
    user = UserService.get_user_by_id(db=db, user_id=user_id)
    if not user:
        raise ResourceNotFoundException(message=f"User with ID {user_id} not found")
    return GoalService.create_goal(db=db, user_id=user_id, goal_in=goal_in)


@router.get(
    "/users/{user_id}/goals",
    response_model=List[GoalResponse],
    summary="List Savings Goals",
    description="Retrieve all savings goals for a user with calculated progress and monthly requirements."
)
def list_goals(
    user_id: int,
    db: Session = Depends(get_db)
) -> List[GoalResponse]:
    """List goals for a user."""
    user = UserService.get_user_by_id(db=db, user_id=user_id)
    if not user:
        raise ResourceNotFoundException(message=f"User with ID {user_id} not found")
    return GoalService.get_user_goals(db=db, user_id=user_id)


@router.get(
    "/users/{user_id}/goals/{goal_id}",
    response_model=GoalResponse,
    summary="Get Goal",
    description="Retrieve a single goal with progress calculations."
)
def get_goal(
    user_id: int,
    goal_id: int,
    db: Session = Depends(get_db)
) -> GoalResponse:
    """Get goal by ID."""
    user = UserService.get_user_by_id(db=db, user_id=user_id)
    if not user:
        raise ResourceNotFoundException(message=f"User with ID {user_id} not found")
    goal = GoalService.get_goal_by_id(db=db, user_id=user_id, goal_id=goal_id)
    if not goal:
        raise ResourceNotFoundException(message=f"Goal with ID {goal_id} not found")
    return GoalService.format_goal_response(goal)


@router.post(
    "/users/{user_id}/goals/{goal_id}/deposit",
    response_model=GoalResponse,
    summary="Deposit Savings to Goal",
    description="Contribute savings to a goal and trigger celebratory completion if target is achieved."
)
def deposit_to_goal(
    user_id: int,
    goal_id: int,
    deposit_in: GoalDepositRequest,
    db: Session = Depends(get_db)
) -> GoalResponse:
    """Add a savings contribution to a goal."""
    user = UserService.get_user_by_id(db=db, user_id=user_id)
    if not user:
        raise ResourceNotFoundException(message=f"User with ID {user_id} not found")
    
    updated_goal = GoalService.deposit_to_goal(db=db, user_id=user_id, goal_id=goal_id, amount=deposit_in.amount)
    if not updated_goal:
        raise ResourceNotFoundException(message=f"Goal with ID {goal_id} not found")
    return updated_goal


@router.patch(
    "/users/{user_id}/goals/{goal_id}",
    response_model=GoalResponse,
    summary="Update Goal",
    description="Update goal target amount, timeline, or category."
)
def update_goal(
    user_id: int,
    goal_id: int,
    goal_in: GoalUpdate,
    db: Session = Depends(get_db)
) -> GoalResponse:
    """Update an existing goal."""
    user = UserService.get_user_by_id(db=db, user_id=user_id)
    if not user:
        raise ResourceNotFoundException(message=f"User with ID {user_id} not found")
    
    updated_goal = GoalService.update_goal(db=db, user_id=user_id, goal_id=goal_id, goal_in=goal_in)
    if not updated_goal:
        raise ResourceNotFoundException(message=f"Goal with ID {goal_id} not found")
    return updated_goal


@router.delete(
    "/users/{user_id}/goals/{goal_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete Goal",
    description="Delete a goal."
)
def delete_goal(
    user_id: int,
    goal_id: int,
    db: Session = Depends(get_db)
) -> None:
    """Delete a goal by ID."""
    user = UserService.get_user_by_id(db=db, user_id=user_id)
    if not user:
        raise ResourceNotFoundException(message=f"User with ID {user_id} not found")
    
    deleted = GoalService.delete_goal(db=db, user_id=user_id, goal_id=goal_id)
    if not deleted:
        raise ResourceNotFoundException(message=f"Goal with ID {goal_id} not found")
