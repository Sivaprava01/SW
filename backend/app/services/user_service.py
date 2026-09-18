"""
Sakhi User Service Module.

Encapsulates all database operations, lifecycle management,
and the reference demo Lakshmi profile generator.
"""

from typing import List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import select
from app.models.user import User
from app.schemas.user import UserCreate, UserUpdate
from app.core.logging import logger


class UserService:
    """User management service handling CRUD and demographic personalization."""

    @staticmethod
    def create_user(db: Session, user_in: UserCreate) -> User:
        """Create and persist a new user."""
        user = User(**user_in.model_dump())
        db.add(user)
        db.commit()
        db.refresh(user)
        logger.info(f"Created user id={user.id} name='{user.name}' state='{user.state}'")
        return user

    @staticmethod
    def get_user_by_id(db: Session, user_id: int) -> Optional[User]:
        """Fetch a user by primary key ID."""
        stmt = select(User).where(User.id == user_id)
        return db.execute(stmt).scalar_one_or_none()

    @staticmethod
    def get_user_by_phone(db: Session, phone_number: str) -> Optional[User]:
        """Fetch a user by phone number."""
        stmt = select(User).where(User.phone_number == phone_number)
        return db.execute(stmt).scalar_one_or_none()

    @staticmethod
    def list_users(db: Session, skip: int = 0, limit: int = 50) -> List[User]:
        """List users with pagination."""
        stmt = select(User).offset(skip).limit(limit)
        return list(db.execute(stmt).scalars().all())

    @staticmethod
    def update_user(db: Session, user: User, user_in: UserUpdate) -> User:
        """Update fields of an existing user profile."""
        update_data = user_in.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(user, field, value)
        
        db.commit()
        db.refresh(user)
        logger.info(f"Updated user id={user.id} with fields {list(update_data.keys())}")
        return user

    @staticmethod
    def delete_user(db: Session, user: User) -> None:
        """Delete a user record."""
        user_id = user.id
        db.delete(user)
        db.commit()
        logger.info(f"Deleted user id={user_id}")

    @staticmethod
    def get_or_create_demo_user(db: Session) -> User:
        """
        Retrieve or seed the official hackathon reference demo user:
        Lakshmi, 28, Telangana, Rural, Telugu, Tailoring micro-entrepreneur,
        SHG member (Gayatri SHG), Income ₹12,000, Expenses ₹7,000, Savings ₹10,000, Debt ₹20,000.
        """
        stmt = select(User).where(User.name == "Lakshmi", User.phone_number == "9876543210")
        demo_user = db.execute(stmt).scalar_one_or_none()
        
        if not demo_user:
            demo_user = User(
                name="Lakshmi",
                phone_number="9876543210",
                age=28,
                gender="female",
                state="Telangana",
                district="Warangal",
                locality_type="rural",
                primary_language="te",
                is_shg_member=True,
                shg_name="Gayatri Mahila Sangham",
                occupation="Tailoring & Dairy",
                monthly_income=12000.0,
                monthly_expenses=7000.0,
                initial_savings=10000.0,
                initial_debt=20000.0,
            )
            db.add(demo_user)
            db.commit()
            db.refresh(demo_user)
            logger.info(f"Seeded official demo user: Lakshmi (id={demo_user.id})")
            
        return demo_user
