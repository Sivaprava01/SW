"""
Sakhi Goal Service Module.

Handles savings goal CRUD, deposit operations, and deterministic monthly requirements.
"""

from typing import List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import select
from app.models.goal import Goal
from app.schemas.goal import GoalCreate, GoalUpdate, GoalResponse
from app.core.logging import logger


class GoalService:
    """Service handling user savings goals and calculations."""

    @staticmethod
    def format_goal_response(goal: Goal) -> GoalResponse:
        """Compute deterministic metrics and return GoalResponse schema."""
        remaining = max(0.0, goal.target_amount - goal.current_amount)
        progress = min(100.0, round((goal.current_amount / goal.target_amount) * 100.0, 1)) if goal.target_amount > 0 else 0.0
        
        months = max(1, goal.target_months)
        required_monthly = round(remaining / months, 2)

        return GoalResponse(
            id=goal.id,
            user_id=goal.user_id,
            name=goal.name,
            target_amount=round(goal.target_amount, 2),
            current_amount=round(goal.current_amount, 2),
            target_months=goal.target_months,
            target_date=goal.target_date,
            category=goal.category,
            priority=goal.priority,
            is_completed=goal.is_completed,
            remaining_amount=round(remaining, 2),
            progress_percentage=progress,
            required_monthly_savings=required_monthly,
            created_at=goal.created_at,
            updated_at=goal.updated_at,
        )

    @staticmethod
    def create_goal(db: Session, user_id: int, goal_in: GoalCreate) -> GoalResponse:
        """Create and persist a new goal for the user."""
        goal = Goal(
            user_id=user_id,
            name=goal_in.name,
            target_amount=goal_in.target_amount,
            current_amount=goal_in.current_amount,
            target_months=goal_in.target_months,
            target_date=goal_in.target_date,
            category=goal_in.category,
            priority=goal_in.priority,
            is_completed=goal_in.current_amount >= goal_in.target_amount,
        )
        db.add(goal)
        db.commit()
        db.refresh(goal)
        logger.info(f"Created goal id={goal.id} '{goal.name}' for user_id={user_id}: Target ₹{goal.target_amount}")
        return GoalService.format_goal_response(goal)

    @staticmethod
    def get_user_goals(db: Session, user_id: int) -> List[GoalResponse]:
        """Fetch all goals for a user ordered by priority."""
        stmt = select(Goal).where(Goal.user_id == user_id).order_by(Goal.priority.asc(), Goal.id.desc())
        goals = list(db.execute(stmt).scalars().all())
        return [GoalService.format_goal_response(g) for g in goals]

    @staticmethod
    def get_goal_by_id(db: Session, user_id: int, goal_id: int) -> Optional[Goal]:
        """Fetch a specific goal record."""
        stmt = select(Goal).where(Goal.id == goal_id, Goal.user_id == user_id)
        return db.execute(stmt).scalar_one_or_none()

    @staticmethod
    def deposit_to_goal(db: Session, user_id: int, goal_id: int, amount: float) -> Optional[GoalResponse]:
        """Add a savings contribution to a goal."""
        goal = GoalService.get_goal_by_id(db, user_id, goal_id)
        if not goal:
            return None
        
        goal.current_amount = round(goal.current_amount + amount, 2)
        if goal.current_amount >= goal.target_amount:
            goal.is_completed = True
            
        db.commit()
        db.refresh(goal)
        logger.info(f"Deposited ₹{amount} to goal id={goal_id}. New saved amount: ₹{goal.current_amount}")
        return GoalService.format_goal_response(goal)

    @staticmethod
    def update_goal(db: Session, user_id: int, goal_id: int, goal_in: GoalUpdate) -> Optional[GoalResponse]:
        """Update fields of an existing goal."""
        goal = GoalService.get_goal_by_id(db, user_id, goal_id)
        if not goal:
            return None
        
        update_data = goal_in.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(goal, field, value)
            
        if goal.current_amount >= goal.target_amount:
            goal.is_completed = True

        db.commit()
        db.refresh(goal)
        logger.info(f"Updated goal id={goal_id} for user_id={user_id}")
        return GoalService.format_goal_response(goal)

    @staticmethod
    def delete_goal(db: Session, user_id: int, goal_id: int) -> bool:
        """Delete a goal."""
        goal = GoalService.get_goal_by_id(db, user_id, goal_id)
        if not goal:
            return False
        db.delete(goal)
        db.commit()
        logger.info(f"Deleted goal id={goal_id} for user_id={user_id}")
        return True
