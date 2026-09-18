"""
Sakhi Financial Knowledge & Golden Rules Schemas.

Pydantic v2 schemas for verified financial literacy concepts and rules.
"""

from typing import Dict, List, Optional
from pydantic import BaseModel, Field


class LocalizedText(BaseModel):
    """Multilingual text container for English, Telugu, and Hindi."""
    en: str = Field(..., description="English text")
    te: str = Field(..., description="Telugu translation / explanation")
    hi: str = Field(..., description="Hindi translation / explanation")


class FinancialConceptResponse(BaseModel):
    """Structured financial literacy concept."""
    id: str
    slug: str
    category: str
    title: LocalizedText
    summary: LocalizedText
    plain_language_explanation: LocalizedText
    practical_action: LocalizedText
    warning_or_pitfall: Optional[LocalizedText] = None


class GoldenRuleResponse(BaseModel):
    """Official Sakhi Golden Financial Rule."""
    rule_number: int
    rule_key: str
    title: LocalizedText
    short_formula: str
    explanation: LocalizedText
    example: LocalizedText
