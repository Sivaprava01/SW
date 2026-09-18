"""
Sakhi Transaction Schemas.

Pydantic v2 schemas for creating, updating, and returning income/expense transactions.
"""

import datetime as dt
from typing import Optional
from pydantic import BaseModel, Field, ConfigDict


class TransactionBase(BaseModel):
    """Base transaction attributes."""
    amount: float = Field(..., gt=0.0, description="Positive transaction amount in INR")
    type: str = Field(..., pattern="^(income|expense)$", description="Transaction type: 'income' or 'expense'")
    category: str = Field(..., min_length=1, max_length=100, description="Transaction category")
    date: dt.date = Field(default_factory=dt.date.today, description="Date of transaction")
    description: Optional[str] = Field(default=None, max_length=255, description="Optional note or context")

    model_config = ConfigDict(populate_by_name=True, from_attributes=True)


class TransactionCreate(TransactionBase):
    """Schema for logging a new transaction."""
    pass


class TransactionResponse(TransactionBase):
    """Output schema for a transaction record."""
    id: int
    user_id: int
    created_at: dt.datetime
    updated_at: dt.datetime

    model_config = ConfigDict(populate_by_name=True, from_attributes=True)
