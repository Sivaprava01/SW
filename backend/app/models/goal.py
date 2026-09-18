"""
Sakhi Goal Database Model.

Represents user savings goals (e.g. Education, Tailoring Machine, Housing, Gold).
"""

from datetime import date
from typing import Optional
from sqlalchemy import String, Integer, Float, Boolean, Date, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.models.base import Base, TimestampMixin


class Goal(Base, TimestampMixin):
    """Savings goal database model."""
    __tablename__ = "goals"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False)
    
    name: Mapped[str] = mapped_column(String(150), nullable=False)
    target_amount: Mapped[float] = mapped_column(Float, nullable=False)
    current_amount: Mapped[float] = mapped_column(Float, nullable=False, default=0.0)
    target_months: Mapped[int] = mapped_column(Integer, nullable=False, default=12)
    target_date: Mapped[Optional[date]] = mapped_column(Date, nullable=True)
    category: Mapped[str] = mapped_column(String(50), nullable=False, default="General Savings")
    priority: Mapped[int] = mapped_column(Integer, nullable=False, default=1)
    is_completed: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)

    # Relationships
    user: Mapped["User"] = relationship("User", backref="goals")

    def __repr__(self) -> str:
        return f"<Goal id={self.id} user_id={self.user_id} name='{self.name}' target={self.target_amount} saved={self.current_amount}>"
