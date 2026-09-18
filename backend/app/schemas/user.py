from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class UserBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    age: int = Field(..., ge=1, le=120)
    state: str = Field(..., min_length=1, max_length=100)
    monthly_income: float = Field(default=0.0, ge=0.0)
    monthly_expenses: float = Field(default=0.0, ge=0.0)
    savings: float = Field(default=0.0, ge=0.0)
    debt: float = Field(default=0.0, ge=0.0)
    financial_goal: Optional[str] = None

class UserCreate(UserBase):
    pass

class UserUpdate(BaseModel):
    name: Optional[str] = None
    age: Optional[int] = None
    state: Optional[str] = None
    monthly_income: Optional[float] = None
    monthly_expenses: Optional[float] = None
    savings: Optional[float] = None
    debt: Optional[float] = None
    financial_goal: Optional[str] = None

class UserResponse(UserBase):
    id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
