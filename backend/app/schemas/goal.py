"""
Sakhi Goal Schemas.

Pydantic v2 schemas for creating, updating, depositing, and calculating goal progress.
"""

import datetime as dt
from typing import Optional
from pydantic import BaseModel, Field, ConfigDict


class GoalBase(BaseModel):
    """Base goal attributes."""
    name: str = Field(..., min_length=1, max_length=150, description="Goal name (e.g. Daughter's Education)")
    target_amount: float = Field(..., gt=0.0, description="Target savings amount in INR")
    current_amount: float = Field(default=0.0, ge=0.0, description="Currently saved amount in INR")
    target_months: int = Field(default=12, ge=1, le=120, description="Target timeline in months")
    target_date: Optional[dt.date] = Field(default=None, description="Optional target completion date")
    category: str = Field(default="General Savings", max_length=50, description="Goal category")
    priority: int = Field(default=1, ge=1, le=5, description="Priority rank (1 = highest)")
    is_completed: bool = Field(default=False, description="Whether goal target is reached")


class GoalCreate(BaseModel):
    """Schema for creating a new goal."""
    name: str = Field(..., min_length=1, max_length=150)
    target_amount: float = Field(..., gt=0.0)
    current_amount: float = Field(default=0.0, ge=0.0)
    target_months: int = Field(default=12, ge=1, le=120)
    target_date: Optional[dt.date] = None
    category: str = Field(default="General Savings", max_length=50)
    priority: int = Field(default=1, ge=1, le=5)


class GoalUpdate(BaseModel):
    """Schema for updating an existing goal."""
    name: Optional[str] = Field(default=None, min_length=1, max_length=150)
    target_amount: Optional[float] = Field(default=None, gt=0.0)
    current_amount: Optional[float] = Field(default=None, ge=0.0)
    target_months: Optional[int] = Field(default=None, ge=1, le=120)
    target_date: Optional[dt.date] = None
    category: Optional[str] = Field(default=None, max_length=50)
    priority: Optional[int] = Field(default=None, ge=1, le=5)
    is_completed: Optional[bool] = None


class GoalDepositRequest(BaseModel):
    """Schema for adding savings towards a goal."""
    amount: float = Field(..., gt=0.0, description="Savings deposit amount in INR")


class GoalResponse(GoalBase):
    """Output schema for a goal with deterministic mathematical calculations."""
    id: int
    user_id: int
    
    # Deterministic Computed Metrics
    remaining_amount: float = Field(..., description="Remaining amount needed (Target - Current, min 0)")
    progress_percentage: float = Field(..., description="Progress percentage towards target (0-100%)")
    required_monthly_savings: float = Field(..., description="Deterministic monthly amount needed (Remaining / Target Months)")
    
    created_at: dt.datetime
    updated_at: dt.datetime

    model_config = ConfigDict(from_attributes=True)
