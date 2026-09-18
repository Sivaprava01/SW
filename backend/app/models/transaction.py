import uuid
from datetime import datetime
from sqlalchemy import Column, String, Numeric, DateTime, ForeignKey, Index
from sqlalchemy.orm import relationship
from app.database import Base

class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    amount = Column(Numeric(12, 2, asdecimal=False), nullable=False)
    type = Column(String(20), nullable=False)  # "income" or "expense"
    category = Column(String(50), nullable=False)
    date = Column(String(20), nullable=False)  # YYYY-MM-DD
    description = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="transactions")

    __table_args__ = (
        Index("ix_transactions_user_id_date", "user_id", "date"),
        Index("ix_transactions_user_id_created_at", "user_id", "created_at"),
    )
