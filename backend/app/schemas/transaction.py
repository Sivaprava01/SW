from pydantic import BaseModel, Field
from typing import Optional, Literal
from datetime import datetime

class TransactionBase(BaseModel):
    amount: float = Field(..., gt=0)
    type: Literal["income", "expense"]
    category: str = Field(..., min_length=1)
    date: str = Field(..., description="YYYY-MM-DD")
    description: Optional[str] = None

class TransactionCreate(TransactionBase):
    user_id: str

class TransactionResponse(TransactionBase):
    id: str
    user_id: str
    created_at: datetime

    class Config:
        from_attributes = True
