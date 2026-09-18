"""
Sakhi AI Companion API Endpoints.

Provides interactive chat with Ask Sakhi AI, live financial grounding diagnostics,
and universal concept explanations.
"""

from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.errors import ResourceNotFoundException
from app.schemas.ai import (
    AIChatRequest,
    AIChatResponse,
    GroundingMetrics,
    ExplainConceptRequest,
    ExplainConceptResponse,
)
from app.services.ai_service import AIService
from app.services.ai_context_builder import AIContextBuilder

router = APIRouter(prefix="/ai", tags=["Ask Sakhi AI Companion"])


@router.post(
    "/chat",
    response_model=AIChatResponse,
    summary="Ask Sakhi Conversational Chat",
    description="Multi-turn conversational interaction with Sakhi AI, grounded in real-time user financial facts and safety guardrails.",
)
def chat_with_sakhi(
    chat_in: AIChatRequest,
    db: Session = Depends(get_db),
) -> AIChatResponse:
    """Conversational endpoint for Ask Sakhi."""
    return AIService.chat(
        user_id=chat_in.user_id,
        message=chat_in.message,
        language=chat_in.language,
        db=db,
    )


@router.get(
    "/grounding/{user_id}",
    response_model=GroundingMetrics,
    summary="Get User AI Grounding Context",
    description="Retrieve the deterministic financial metrics and facts compiled to ground the AI companion for a user.",
)
def get_user_grounding_context(
    user_id: int,
    db: Session = Depends(get_db),
) -> GroundingMetrics:
    """Retrieve financial grounding metrics for a user."""
    context = AIContextBuilder.build_grounding_context(db=db, user_id=user_id)
    if not context:
        raise ResourceNotFoundException(message=f"User with ID {user_id} not found")
    return context["metrics"]


@router.post(
    "/explain",
    response_model=ExplainConceptResponse,
    summary="Universal Concept Explanation",
    description="Generate a simple, conversational Indic explanation for a financial concept or calculator.",
)
def explain_financial_concept(
    explain_in: ExplainConceptRequest,
) -> ExplainConceptResponse:
    """Universal concept explainer endpoint."""
    return AIService.explain_concept(
        concept_slug=explain_in.concept_slug,
        language=explain_in.language,
    )
