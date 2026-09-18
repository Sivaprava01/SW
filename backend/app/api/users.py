from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.models.goal import Goal
from app.schemas.user import UserCreate, UserUpdate, UserResponse

router = APIRouter(prefix="/api/users", tags=["Users"])

@router.post("", response_model=UserResponse)
def create_user(user_in: UserCreate, db: Session = Depends(get_db)):
    """Creates a new user profile from the onboarding flow."""
    user = User(
        name=user_in.name,
        age=user_in.age,
        state=user_in.state,
        monthly_income=user_in.monthly_income,
        monthly_expenses=user_in.monthly_expenses,
        savings=user_in.savings,
        debt=user_in.debt,
        financial_goal=user_in.financial_goal
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    # If an initial financial goal was set during onboarding, auto-create a Goal record
    if user_in.financial_goal:
        target_amount = 50000.0  # sensible default if unspecified
        # Parse simple name or default
        goal = Goal(
            user_id=user.id,
            name=user_in.financial_goal,
            category="Education" if "educat" in user_in.financial_goal.lower() else "Personal",
            target_amount=target_amount,
            current_amount=min(user_in.savings, 10000.0),
            target_date="12"  # 12 months
        )
        db.add(goal)
        db.commit()

    return user

@router.get("/{user_id}", response_model=UserResponse)
def get_user(user_id: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.put("/{user_id}", response_model=UserResponse)
def update_user(user_id: str, user_in: UserUpdate, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    update_data = user_in.model_dump(exclude_unset=True)
    for field, val in update_data.items():
        setattr(user, field, val)

    db.commit()
    db.refresh(user)
    return user

@router.post("/demo/lakshmi", response_model=UserResponse)
def load_demo_lakshmi(db: Session = Depends(get_db)):
    """
    Creates or returns the official Demo Lakshmi profile as outlined in Section 31:
    Name: Lakshmi, Age: 28, State: Telangana, Income: ₹12,000, Expenses: ₹7,000,
    Savings: ₹10,000, Debt: ₹20,000, Goal: Daughter's Education ₹50,000.
    """
    user = db.query(User).filter(User.name == "Lakshmi", User.state == "Telangana").first()
    if not user:
        user = User(
            name="Lakshmi",
            age=28,
            state="Telangana",
            monthly_income=12000.0,
            monthly_expenses=7000.0,
            savings=10000.0,
            debt=20000.0,
            financial_goal="Daughter's Education"
        )
        db.add(user)
        db.commit()
        db.refresh(user)

        # Add initial goal
        goal = Goal(
            user_id=user.id,
            name="Daughter's Education",
            category="Education",
            target_amount=50000.0,
            current_amount=10000.0,
            target_date="12"  # 12 months
        )
        db.add(goal)
        db.commit()
    return user
