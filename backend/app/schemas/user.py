from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class UserBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    age: int = Field(..., ge=1, le=120)
    state: str = Field(..., min_length=1, max_length=100)
    gender: str = Field(default="women")
    is_shg_member: bool = Field(default=False)
    has_business_interest: bool = Field(default=False)
    is_rural: bool = Field(default=True)
    occupation: Optional[str] = None
    monthly_income: float = Field(default=0.0, ge=0.0)
    monthly_expenses: float = Field(default=0.0, ge=0.0)
    savings: float = Field(default=0.0, ge=0.0)
    debt: float = Field(default=0.0, ge=0.0)
    financial_goal: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None

class UserCreate(UserBase):
    pass

class UserUpdate(BaseModel):
    name: Optional[str] = None
    age: Optional[int] = None
    state: Optional[str] = None
    gender: Optional[str] = None
    is_shg_member: Optional[bool] = None
    has_business_interest: Optional[bool] = None
    is_rural: Optional[bool] = None
    occupation: Optional[str] = None
    monthly_income: Optional[float] = None
    monthly_expenses: Optional[float] = None
    savings: Optional[float] = None
    debt: Optional[float] = None
    financial_goal: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None

class UserResponse(UserBase):
    id: str
    role: str = "USER"
    is_active: bool = True
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
