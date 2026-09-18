import uuid
from datetime import datetime
from sqlalchemy import Column, String, Numeric, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class Goal(Base):
    __tablename__ = "goals"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    name = Column(String(100), nullable=False)
    category = Column(String(50), nullable=False)  # Education, Emergency Fund, Business, House, Healthcare, Other
    target_amount = Column(Numeric(12, 2, asdecimal=False), nullable=False)
    current_amount = Column(Numeric(12, 2, asdecimal=False), nullable=False, default=0.0)
    target_date = Column(String(20), nullable=False)  # YYYY-MM-DD or duration
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="goals")
