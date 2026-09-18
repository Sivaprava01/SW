from pydantic import BaseModel
from typing import Optional, Dict, Any, List

class AIChatRequest(BaseModel):
    user_id: str
    message: str
    language: Optional[str] = "en"  # en, hi, te

class FinancialContextPayload(BaseModel):
    name: str
    income: float
    expenses: float
    surplus: float
    savings: float
    debt: float
    current_journey_stage: str
    emergency_fund: Dict[str, Any]
    primary_goal: Optional[Dict[str, Any]] = None
    state: Optional[str] = "All India"
    age: Optional[int] = 30
    is_shg_member: Optional[bool] = False
    language: Optional[str] = "en"

class AIChatResponse(BaseModel):
    reply: str
    context_used: Optional[FinancialContextPayload] = None
    suggested_actions: Optional[List[str]] = None
    is_fallback: bool = False

