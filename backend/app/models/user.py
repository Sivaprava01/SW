"""
Sakhi User Database Model.

Represents user demographic profiles, socio-economic attributes,
SHG membership, language preferences, and baseline financial figures.
"""

from typing import Optional
from sqlalchemy import String, Integer, Float, Boolean
from sqlalchemy.orm import Mapped, mapped_column
from app.models.base import Base, TimestampMixin


class User(Base, TimestampMixin):
    """User profile database model."""
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    phone_number: Mapped[Optional[str]] = mapped_column(String(20), index=True, nullable=True)
    hashed_password: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    age: Mapped[int] = mapped_column(Integer, nullable=False, default=25)
    gender: Mapped[str] = mapped_column(String(20), nullable=False, default="female")
    
    # Demographic & Geographic Attributes
    state: Mapped[str] = mapped_column(String(100), nullable=False, default="Telangana")
    district: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    locality_type: Mapped[str] = mapped_column(String(50), nullable=False, default="rural")
    primary_language: Mapped[str] = mapped_column(String(10), nullable=False, default="te")
    
    # Self-Help Group (SHG) & Livelihood Attributes
    is_shg_member: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    shg_name: Mapped[Optional[str]] = mapped_column(String(150), nullable=True)
    occupation: Mapped[Optional[str]] = mapped_column(String(100), nullable=True, default="Tailoring")
    
    # Baseline Financial Snapshot captured at onboarding (INR)
    monthly_income: Mapped[float] = mapped_column(Float, nullable=False, default=0.0)
    monthly_expenses: Mapped[float] = mapped_column(Float, nullable=False, default=0.0)
    initial_savings: Mapped[float] = mapped_column(Float, nullable=False, default=0.0)
    initial_debt: Mapped[float] = mapped_column(Float, nullable=False, default=0.0)

    def __repr__(self) -> str:
        return f"<User id={self.id} name='{self.name}' state='{self.state}' language='{self.primary_language}'>"
