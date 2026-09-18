from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class GoalBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    category: str = Field(default="Other")
    target_amount: float = Field(..., gt=0)
    current_amount: float = Field(default=0.0, ge=0)
    target_date: str = Field(..., description="Target completion date YYYY-MM-DD or duration")

class GoalCreate(GoalBase):
    user_id: str

class GoalUpdate(BaseModel):
    name: Optional[str] = None
    category: Optional[str] = None
    target_amount: Optional[float] = None
    current_amount: Optional[float] = None
    target_date: Optional[str] = None

class GoalResponse(GoalBase):
    id: str
    user_id: str
    remaining_amount: float = 0.0
    months_remaining: int = 1
    monthly_saving_required: float = 0.0
    percent_complete: float = 0.0
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
