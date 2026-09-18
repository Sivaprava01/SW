import uuid
from datetime import datetime
from sqlalchemy import Column, String, Numeric, Integer, DateTime, Boolean
from sqlalchemy.orm import relationship
from app.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String(100), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=True)
    phone = Column(String(20), unique=True, index=True, nullable=True)
    password_hash = Column(String(255), nullable=True)
    role = Column(String(20), default="USER", server_default="USER", nullable=False)  # "USER", "ADMIN"
    is_active = Column(Boolean, default=True, server_default="true", nullable=False)

    age = Column(Integer, nullable=False)
    state = Column(String(100), nullable=False)
    gender = Column(String(20), nullable=False, default="women")  # "women", "men", "other"
    is_shg_member = Column(Boolean, nullable=False, default=False)
    has_business_interest = Column(Boolean, nullable=False, default=False)
    is_rural = Column(Boolean, nullable=False, default=True)
    occupation = Column(String(100), nullable=True)  # e.g., "Tailor", "Farmer", "Daily Wage", "Kirana Shop"
    
    # Financial fields: exact decimal/numeric in PostgreSQL
    monthly_income = Column(Numeric(12, 2, asdecimal=False), nullable=False, default=0.0)
    monthly_expenses = Column(Numeric(12, 2, asdecimal=False), nullable=False, default=0.0)
    savings = Column(Numeric(12, 2, asdecimal=False), nullable=False, default=0.0)
    debt = Column(Numeric(12, 2, asdecimal=False), nullable=False, default=0.0)
    financial_goal = Column(String(200), nullable=True)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    transactions = relationship("Transaction", back_populates="user", cascade="all, delete-orphan")
    goals = relationship("Goal", back_populates="user", cascade="all, delete-orphan")
    scheme_matches = relationship("UserSchemeMatch", back_populates="user", cascade="all, delete-orphan")
    refresh_tokens = relationship("RefreshToken", back_populates="user", cascade="all, delete-orphan")
