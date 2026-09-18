from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.goal import Goal
from app.models.user import User
from app.schemas.goal import GoalCreate, GoalUpdate, GoalResponse
from app.services.financial_engine import calculate_goal_metrics

router = APIRouter(prefix="/api/goals", tags=["Goals"])

def enrich_goal(goal: Goal) -> GoalResponse:
    metrics = calculate_goal_metrics(goal.target_amount, goal.current_amount, goal.target_date)
    return GoalResponse(
        id=goal.id,
        user_id=goal.user_id,
        name=goal.name,
        category=goal.category,
        target_amount=metrics["target_amount"],
        current_amount=metrics["current_amount"],
        target_date=goal.target_date,
        remaining_amount=metrics["remaining_amount"],
        months_remaining=metrics["months_remaining"],
        monthly_saving_required=metrics["monthly_saving_required"],
        percent_complete=metrics["percent_complete"],
        created_at=goal.created_at,
        updated_at=goal.updated_at
    )

@router.post("", response_model=GoalResponse)
def create_goal(goal_in: GoalCreate, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == goal_in.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    goal = Goal(
        user_id=goal_in.user_id,
        name=goal_in.name,
        category=goal_in.category,
        target_amount=goal_in.target_amount,
        current_amount=goal_in.current_amount,
        target_date=goal_in.target_date
    )
    db.add(goal)
    db.commit()
    db.refresh(goal)
    return enrich_goal(goal)

@router.get("/{user_id}", response_model=List[GoalResponse])
def get_user_goals(user_id: str, db: Session = Depends(get_db)):
    goals = db.query(Goal).filter(Goal.user_id == user_id).order_by(Goal.created_at.desc()).all()
    return [enrich_goal(g) for g in goals]

@router.put("/{goal_id}", response_model=GoalResponse)
def update_goal(goal_id: str, goal_in: GoalUpdate, db: Session = Depends(get_db)):
    goal = db.query(Goal).filter(Goal.id == goal_id).first()
    if not goal:
        raise HTTPException(status_code=404, detail="Goal not found")

    update_data = goal_in.model_dump(exclude_unset=True)
    for field, val in update_data.items():
        setattr(goal, field, val)

    db.commit()
    db.refresh(goal)
    return enrich_goal(goal)

@router.delete("/{goal_id}")
def delete_goal(goal_id: str, db: Session = Depends(get_db)):
    goal = db.query(Goal).filter(Goal.id == goal_id).first()
    if not goal:
        raise HTTPException(status_code=404, detail="Goal not found")

    db.delete(goal)
    db.commit()
    return {"message": "Goal deleted successfully"}
