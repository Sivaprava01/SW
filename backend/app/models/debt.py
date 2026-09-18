"""
Sakhi Debt Database Model.

Represents user liabilities, moneylender loans, SHG borrowings, and bank credit.
"""

from typing import Optional
from sqlalchemy import String, Integer, Float, Boolean, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.models.base import Base, TimestampMixin


class Debt(Base, TimestampMixin):
    """Debt liability database model."""
    __tablename__ = "debts"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False)
    
    lender_name: Mapped[str] = mapped_column(String(150), nullable=False)
    lender_type: Mapped[str] = mapped_column(String(50), nullable=False, default="moneylender")  # moneylender, shg, bank, family_friend
    principal_amount: Mapped[float] = mapped_column(Float, nullable=False)
    current_balance: Mapped[float] = mapped_column(Float, nullable=False)
    monthly_interest_rate: Mapped[float] = mapped_column(Float, nullable=False, default=3.0)  # e.g. 3% per month = 36% APR
    annual_interest_rate: Mapped[float] = mapped_column(Float, nullable=False, default=36.0)
    monthly_emi_payment: Mapped[float] = mapped_column(Float, nullable=False, default=0.0)
    is_cleared: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    notes: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)

    # Relationships
    user: Mapped["User"] = relationship("User", backref="debts")

    def __repr__(self) -> str:
        return f"<Debt id={self.id} user_id={self.user_id} lender='{self.lender_name}' balance={self.current_balance}>"
