import uuid
from datetime import datetime
from sqlalchemy import Column, String, Float, Integer, DateTime, Boolean
from sqlalchemy.orm import relationship
from app.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String(100), nullable=False)
    age = Column(Integer, nullable=False)
    state = Column(String(100), nullable=False)
    gender = Column(String(20), nullable=False, default="women")  # "women", "men", "other"
    is_shg_member = Column(Boolean, nullable=False, default=False)
    has_business_interest = Column(Boolean, nullable=False, default=False)
    is_rural = Column(Boolean, nullable=False, default=True)
    occupation = Column(String(100), nullable=True)  # e.g., "Tailor", "Farmer", "Daily Wage", "Kirana Shop"
    
    monthly_income = Column(Float, nullable=False, default=0.0)
    monthly_expenses = Column(Float, nullable=False, default=0.0)
    savings = Column(Float, nullable=False, default=0.0)
    debt = Column(Float, nullable=False, default=0.0)
    financial_goal = Column(String(200), nullable=True)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    transactions = relationship("Transaction", back_populates="user", cascade="all, delete-orphan")
    goals = relationship("Goal", back_populates="user", cascade="all, delete-orphan")
    scheme_matches = relationship("UserSchemeMatch", back_populates="user", cascade="all, delete-orphan")
