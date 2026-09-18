"""
Sakhi User Schemas.

Pydantic v2 validation models for user onboarding, updates, and profile responses.
"""

from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field, ConfigDict


class UserBase(BaseModel):
    """Base user profile attributes."""
    name: str = Field(..., min_length=1, max_length=100, description="Full name of user")
    phone_number: Optional[str] = Field(default=None, max_length=20, description="Contact phone number")
    age: int = Field(default=25, ge=14, le=120, description="User age in years")
    gender: str = Field(default="female", max_length=20, description="User gender")
    
    state: str = Field(default="Telangana", max_length=100, description="State of residence")
    district: Optional[str] = Field(default=None, max_length=100, description="District of residence")
    locality_type: str = Field(default="rural", max_length=50, description="rural, urban, or semi-urban")
    primary_language: str = Field(default="te", min_length=2, max_length=10, description="te, hi, or en")
    
    is_shg_member: bool = Field(default=False, description="Whether user belongs to a Self-Help Group")
    shg_name: Optional[str] = Field(default=None, max_length=150, description="Name of SHG group/federation")
    occupation: Optional[str] = Field(default="Tailoring", max_length=100, description="Primary livelihood/occupation")
    
    monthly_income: float = Field(default=0.0, ge=0.0, description="Baseline monthly income in INR")
    monthly_expenses: float = Field(default=0.0, ge=0.0, description="Baseline monthly expenses in INR")
    initial_savings: float = Field(default=0.0, ge=0.0, description="Current total savings in INR")
    initial_debt: float = Field(default=0.0, ge=0.0, description="Current outstanding debt in INR")


class UserCreate(UserBase):
    """Schema for creating / onboarding a new user."""
    pass


class UserUpdate(BaseModel):
    """Schema for updating an existing user profile (all fields optional)."""
    name: Optional[str] = Field(default=None, min_length=1, max_length=100)
    phone_number: Optional[str] = Field(default=None, max_length=20)
    age: Optional[int] = Field(default=None, ge=14, le=120)
    gender: Optional[str] = Field(default=None, max_length=20)
    state: Optional[str] = Field(default=None, max_length=100)
    district: Optional[str] = Field(default=None, max_length=100)
    locality_type: Optional[str] = Field(default=None, max_length=50)
    primary_language: Optional[str] = Field(default=None, min_length=2, max_length=10)
    is_shg_member: Optional[bool] = None
    shg_name: Optional[str] = Field(default=None, max_length=150)
    occupation: Optional[str] = Field(default=None, max_length=100)
    monthly_income: Optional[float] = Field(default=None, ge=0.0)
    monthly_expenses: Optional[float] = Field(default=None, ge=0.0)
    initial_savings: Optional[float] = Field(default=None, ge=0.0)
    initial_debt: Optional[float] = Field(default=None, ge=0.0)


class UserPreferencesUpdate(BaseModel):
    """Quick update schema for language and SHG membership."""
    primary_language: Optional[str] = Field(default=None, min_length=2, max_length=10)
    is_shg_member: Optional[bool] = None
    shg_name: Optional[str] = None


class UserResponse(UserBase):
    """Output user profile response schema."""
    id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
