"""
Sakhi Financial Knowledge & Golden Rules API Endpoints.

Provides access to verified financial concepts, practical actions,
warnings, and the 5 Golden Rules of Sakhi in English, Telugu, and Hindi.
"""

from typing import List, Optional
from fastapi import APIRouter, Query, status
from app.core.errors import ResourceNotFoundException
from app.schemas.knowledge import FinancialConceptResponse, GoldenRuleResponse
from app.services.knowledge_service import KnowledgeService

router = APIRouter(prefix="/knowledge", tags=["Financial Knowledge & Golden Rules"])


@router.get(
    "/concepts",
    response_model=List[FinancialConceptResponse],
    summary="List Financial Literacy Concepts",
    description="Retrieve verified financial literacy concepts with multilingual explanations (English, Telugu, Hindi)."
)
def list_concepts(
    category: Optional[str] = Query(default=None, description="Filter by concept category")
) -> List[FinancialConceptResponse]:
    """List financial literacy concepts."""
    return KnowledgeService.list_concepts(category=category)


@router.get(
    "/concepts/{concept_id}",
    response_model=FinancialConceptResponse,
    summary="Get Financial Concept",
    description="Retrieve a single concept by ID or slug with full multilingual explanations."
)
def get_concept(concept_id: str) -> FinancialConceptResponse:
    """Get concept by slug or ID."""
    concept = KnowledgeService.get_concept_by_slug(concept_id)
    if not concept:
        raise ResourceNotFoundException(message=f"Financial concept '{concept_id}' not found")
    return concept


@router.get(
    "/golden-rules",
    response_model=List[GoldenRuleResponse],
    summary="Get 5 Golden Rules of Sakhi",
    description="Retrieve the 5 core financial rules for rural women and SHG members in English, Telugu, and Hindi."
)
def get_golden_rules() -> List[GoldenRuleResponse]:
    """Retrieve the 5 Golden Rules."""
    return KnowledgeService.get_golden_rules()
