"""
Sakhi AI Companion & Grounding Schemas.

Pydantic v2 schemas for conversational AI chat, live financial grounding metrics,
and universal concept explanations.
"""

from typing import List, Optional
from pydantic import BaseModel, Field, ConfigDict


class AIChatRequest(BaseModel):
    """Request payload for conversational AI chat with Ask Sakhi."""
    user_id: int = Field(..., description="User ID for financial grounding context")
    message: str = Field(..., min_length=1, max_length=1000, description="User question or query")
    language: str = Field(default="en", description="Target response language ('en', 'te', 'hi')")


class GroundingMetrics(BaseModel):
    """Live deterministic financial facts injected into the AI context."""
    user_name: str
    monthly_income: float
    monthly_expenses: float
    monthly_surplus: float
    savings_ratio_percentage: float
    current_savings: float
    emergency_fund_target: float
    emergency_fund_progress_percentage: float
    total_debt: float
    monthly_interest_drain: float
    active_goals_count: int
    current_stage: int
    current_stage_title: str
    matched_schemes_count: int
    is_shg_member: bool


class AIChatResponse(BaseModel):
    """Response returned from Ask Sakhi conversational companion."""
    reply: str = Field(..., description="Conversational, safe, grounded response from Sakhi")
    language: str = Field(..., description="Response language ('en', 'te', 'hi')")
    is_fallback: bool = Field(default=False, description="Whether response was generated via deterministic fallback")
    grounding_metrics: Optional[GroundingMetrics] = Field(default=None, description="Snapshot of user's financial metrics")
    suggested_followups: List[str] = Field(default_factory=list, description="Contextual follow-up suggestions")


class ExplainConceptRequest(BaseModel):
    """Request payload for Universal Explain endpoint."""
    concept_slug: str = Field(..., description="Identifier of financial concept or calculator")
    language: str = Field(default="en", description="Target language ('en', 'te', 'hi')")


class ExplainConceptResponse(BaseModel):
    """Conversational explanation response for a financial concept."""
    concept_slug: str
    title: str
    explanation: str
    practical_example: str
    golden_rule: Optional[str] = None
    language: str
