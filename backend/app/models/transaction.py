"""
Sakhi Transaction Database Model.

Represents individual income and expense transaction entries logged by the user.
"""

from datetime import date, datetime
from typing import Optional
from sqlalchemy import String, Integer, Float, Date, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.models.base import Base, TimestampMixin


class Transaction(Base, TimestampMixin):
    """Transaction database model."""
    __tablename__ = "transactions"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False)
    
    amount: Mapped[float] = mapped_column(Float, nullable=False)
    type: Mapped[str] = mapped_column(String(20), nullable=False)  # "income" or "expense"
    category: Mapped[str] = mapped_column(String(100), nullable=False)
    date: Mapped[date] = mapped_column(Date, nullable=False, default=date.today)
    description: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)

    # Relationships
    user: Mapped["User"] = relationship("User", backref="transactions")

    def __repr__(self) -> str:
        return f"<Transaction id={self.id} user_id={self.user_id} type='{self.type}' amount={self.amount}>"
