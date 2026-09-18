from pydantic import BaseModel, Field
from typing import Optional, List

class SchemeBase(BaseModel):
    name: str
    description: str
    what_it_provides: str
    target_users: str
    basic_eligibility: str
    required_documents: str
    application_process: str
    official_source: str
    state: str
    category: str

class SchemeResponse(SchemeBase):
    id: str

    class Config:
        from_attributes = True

class SchemeMatchRequest(BaseModel):
    user_id: Optional[str] = None
    is_woman: bool = True
    age: int = 25
    state: str = "Telangana"
    income_level: Optional[str] = "low"  # "low", "medium", "any"
    has_business_interest: bool = False
    is_shg_member: bool = False
    is_rural: bool = True

class MatchedSchemeItem(BaseModel):
    scheme: SchemeResponse
    match_score: int
    reasons: List[str]
    disclaimer: str = "Sakhi provides a preliminary eligibility match and does not provide official eligibility confirmation."

class SchemeMatchResponse(BaseModel):
    matches: List[MatchedSchemeItem]
    total_matched: int
    disclaimer: str = "Sakhi provides a preliminary eligibility match and does not provide official eligibility confirmation."
