from pydantic import BaseModel, Field, field_validator
from typing import Optional, Literal
from datetime import datetime, date

class TransactionBase(BaseModel):
    amount: float = Field(..., gt=0)
    type: Literal["income", "expense"]
    category: str = Field(..., min_length=1)
    date: str = Field(..., description="YYYY-MM-DD")
    description: Optional[str] = None

    @field_validator("date")
    @classmethod
    def validate_not_future(cls, v: str) -> str:
        try:
            tx_date = datetime.strptime(v[:10], "%Y-%m-%d").date()
        except Exception as e:
            raise ValueError("Invalid date format. Use YYYY-MM-DD.") from e

        if tx_date > date.today():
            raise ValueError("Transaction date cannot be in the future.")

        return v[:10]

class TransactionCreate(TransactionBase):
    user_id: str

class TransactionResponse(TransactionBase):
    id: str
    user_id: str
    created_at: datetime

    class Config:
        from_attributes = True
