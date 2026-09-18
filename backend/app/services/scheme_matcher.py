from typing import List, Dict, Any, Optional
from sqlalchemy.orm import Session
from app.models.scheme import GovernmentScheme
from app.models.user import User
from app.schemas.scheme import SchemeMatchRequest, MatchedSchemeItem, SchemeResponse

DISCLAIMER_TEXT = "Sakhi provides a preliminary eligibility match and does not provide official eligibility confirmation."

def match_schemes(db: Session, request: SchemeMatchRequest) -> List[MatchedSchemeItem]:
    """
    Rule-based preliminary matching engine for government schemes.
    Checks gender, age, state (Central + matched state), business interest, and SHG affiliation.
    """
    schemes = db.query(GovernmentScheme).all()
    matched_results: List[MatchedSchemeItem] = []
    
    is_woman = bool(request.is_woman)

    for s in schemes:
        score = 60  # baseline interest score
        reasons = []

        # 1. State matching: Central applies to all, or exact state match
        if s.state != "Central":
            if s.state.lower() == (request.state or "").lower():
                score += 25
                reasons.append(f"Specifically benefits residents of {s.state}")
            else:
                # Different state-specific scheme
                continue
        else:
            reasons.append("Applicable across India (Central Scheme)")

        # 2. Gender matching
        if s.gender_target == "women":
            if is_woman:
                score += 20
                reasons.append("Dedicated program empowering women")
            else:
                # Exclusively for women
                continue

        # 3. Age matching
        if s.min_age is not None and request.age < s.min_age:
            # Special case: SSY is for girl child under 10
            if s.id == "scheme-sukanya-samriddhi" and request.age >= 18:
                # Parent can apply on behalf of a daughter
                reasons.append("Parent/guardian can apply for daughter (under 10 yrs)")
            else:
                continue

        if s.max_age is not None and request.age > s.max_age:
            continue
        else:
            if s.min_age is not None:
                reasons.append(f"Age {request.age} satisfies required age bracket ({s.min_age}-{s.max_age or 'above'})")

        # 4. Business interest
        if s.is_business_related:
            if request.has_business_interest:
                score += 25
                reasons.append("Matches your goal to start or expand a micro business / trade")
            else:
                score -= 10

        # 5. SHG affiliation
        if s.is_shg_related:
            if request.is_shg_member:
                score += 30
                reasons.append("Offers special credit and training to SHG members")
            else:
                score -= 15

        # 6. Rural relevance
        if s.is_rural_relevant and request.is_rural:
            score += 10
            reasons.append("Tailored for rural livelihoods and villages")

        if score >= 60:
            matched_results.append(
                MatchedSchemeItem(
                    scheme=SchemeResponse.model_validate(s),
                    match_score=min(100, score),
                    reasons=reasons,
                    disclaimer=DISCLAIMER_TEXT
                )
            )

    # Sort by match score descending
    matched_results.sort(key=lambda x: x.match_score, reverse=True)
    return matched_results

def match_schemes_for_user(db: Session, user: User) -> List[MatchedSchemeItem]:
    """
    Direct matching helper using a User record from the database.
    """
    req = SchemeMatchRequest(
        user_id=user.id,
        is_woman=(user.gender == "women"),
        age=user.age,
        state=user.state,
        income_level="low",
        has_business_interest=user.has_business_interest,
        is_shg_member=user.is_shg_member,
        is_rural=user.is_rural
    )
    return match_schemes(db, req)
