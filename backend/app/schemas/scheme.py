"""
Sakhi Government Scheme Schemas.

Pydantic v2 schemas for schemes catalog, eligibility matching output, and user bookmarks.
"""

import json
from typing import List, Optional, Literal
from pydantic import BaseModel, Field, ConfigDict, field_validator


class SchemeBase(BaseModel):
    """Base government scheme attributes."""
    slug: str = Field(..., max_length=100, description="Unique slug identifier")
    name: str = Field(..., max_length=200, description="Full scheme title")
    short_name: str = Field(..., max_length=50, description="Short name / acronym")
    category: str = Field(..., max_length=100, description="Category classification")
    jurisdiction: str = Field(default="Central", max_length=100, description="Central or State jurisdiction")
    
    benefit_amount_display: str = Field(..., description="Human-readable benefit value (e.g. ₹2,00,000 Cover)")
    cost_or_premium: str = Field(..., description="Cost or premium to enrol (e.g. ₹20 / year)")
    
    min_age: int = Field(default=18, ge=0, le=120)
    max_age: int = Field(default=70, ge=0, le=120)
    gender_eligibility: Literal["female_only", "all", "male_only"] = Field(default="all")
    rural_urban: Literal["rural", "urban", "all"] = Field(default="all")
    requires_shg: bool = Field(default=False)
    max_annual_income: Optional[float] = None
    
    description: str = Field(..., description="Overview description")
    what_it_provides: str = Field(..., description="Core entitlements and benefits")
    target_beneficiaries: str = Field(..., description="Target audience")
    required_documents: List[str] = Field(default_factory=list, description="List of required application documents")
    offline_application_process: str = Field(..., description="Step-by-step application guidance")
    official_portal_url: Optional[str] = None
    is_active: bool = True


class SchemeResponse(SchemeBase):
    """Output schema for a government scheme."""
    id: int

    model_config = ConfigDict(from_attributes=True)

    @field_validator("required_documents", mode="before")
    @classmethod
    def parse_documents(cls, v):
        if isinstance(v, str):
            try:
                return json.loads(v)
            except Exception:
                return [v]
        return v or []


class SchemeMatchResponse(SchemeResponse):
    """Scheme enriched with user-specific deterministic eligibility match score and checklist."""
    match_score: float = Field(..., ge=0.0, le=100.0, description="Eligibility match score (0-100%)")
    is_eligible: bool = Field(..., description="Whether user strictly meets all criteria")
    eligibility_reasons: List[str] = Field(default_factory=list, description="Criteria met by user")
    missing_requirements: List[str] = Field(default_factory=list, description="Criteria missing / restricting user")
    user_application_status: Optional[str] = Field(default=None, description="discovered, applied, enrolled, or bookmarked")


class BookmarkRequest(BaseModel):
    """Schema for bookmarking a scheme or updating application status."""
    is_bookmarked: bool = Field(default=True)
    application_status: Literal["discovered", "applied", "enrolled", "dismissed"] = Field(default="discovered")
    notes: Optional[str] = Field(default=None, max_length=255)


class BookmarkResponse(BaseModel):
    """Output schema for a user's scheme bookmark."""
    id: int
    user_id: int
    scheme_id: int
    is_bookmarked: bool
    application_status: str
    notes: Optional[str]
    scheme: SchemeResponse

    model_config = ConfigDict(from_attributes=True)
