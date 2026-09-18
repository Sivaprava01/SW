"""
Sakhi Government Scheme Deterministic Matcher Engine.

Evaluates user demographic, geographic, and socioeconomic attributes
against official criteria to determine scheme eligibility and match scores.
"""

from typing import Dict, Any, List
from app.models.user import User
from app.models.scheme import GovernmentScheme


class SchemeMatcher:
    """Pure deterministic rule-based scheme eligibility engine."""

    @staticmethod
    def evaluate(user: User, scheme: GovernmentScheme) -> Dict[str, Any]:
        """
        Evaluate a user profile against a specific government scheme's eligibility rules.
        
        Evaluates 6 core dimensions:
        1. Age eligibility bracket (min_age to max_age)
        2. Gender eligibility (female_only, male_only, all)
        3. Locality type (rural, urban, all)
        4. Self-Help Group (SHG) membership requirement
        5. State / National jurisdiction alignment
        6. Maximum annual income ceiling (if applicable)

        Returns match details: match_score (0-100), is_eligible (bool),
        eligibility_reasons (List[str]), and missing_requirements (List[str]).
        """
        passed_reasons: List[str] = []
        missing_requirements: List[str] = []
        total_criteria_count = 6

        # 1. Age Rule
        if scheme.min_age <= user.age <= scheme.max_age:
            passed_reasons.append(
                f"Age {user.age} falls within eligible bracket ({scheme.min_age}–{scheme.max_age} years)"
            )
        else:
            if user.age < scheme.min_age:
                missing_requirements.append(
                    f"Age {user.age} is below minimum requirement of {scheme.min_age} years"
                )
            else:
                missing_requirements.append(
                    f"Age {user.age} exceeds maximum age limit of {scheme.max_age} years"
                )

        # 2. Gender Rule
        user_gender = (user.gender or "").strip().lower()
        if scheme.gender_eligibility == "all":
            passed_reasons.append("Open to all genders")
        elif scheme.gender_eligibility == "female_only":
            if user_gender == "female":
                passed_reasons.append("Gender requirement met (Exclusively for women)")
            else:
                missing_requirements.append("Scheme is exclusively designed for women and female applicants")
        elif scheme.gender_eligibility == "male_only":
            if user_gender == "male":
                passed_reasons.append("Gender requirement met (Male applicants)")
            else:
                missing_requirements.append("Scheme is exclusively designed for male applicants")

        # 3. Locality Rule (Rural / Urban)
        user_locality = (user.locality_type or "").strip().lower()
        if scheme.rural_urban == "all":
            passed_reasons.append("Open to both rural and urban residents")
        elif scheme.rural_urban.lower() == user_locality:
            passed_reasons.append(f"Locality verified ({user.locality_type.capitalize()} resident)")
        else:
            missing_requirements.append(
                f"Restricted to {scheme.rural_urban.capitalize()} areas (User resides in {user.locality_type.capitalize()} area)"
            )

        # 4. SHG Membership Rule
        if not scheme.requires_shg:
            passed_reasons.append("Open to individual citizens (No SHG required)")
        else:
            if user.is_shg_member:
                passed_reasons.append("Self-Help Group (SHG) membership verified")
            else:
                missing_requirements.append(
                    "Requires active membership in a Self-Help Group (SHG) or Village Organization"
                )

        # 5. Jurisdiction / State Rule
        valid_jurisdictions = ["Central", "All States", user.state]
        if scheme.jurisdiction in valid_jurisdictions:
            if scheme.jurisdiction == "Central":
                passed_reasons.append(f"National Central Government program (Available in {user.state})")
            else:
                passed_reasons.append(f"State welfare program active in {user.state}")
        else:
            missing_requirements.append(
                f"Restricted to residents of {scheme.jurisdiction} (User is registered in {user.state})"
            )

        # 6. Income Ceiling Rule
        user_annual_income = (user.monthly_income or 0.0) * 12
        if scheme.max_annual_income is None:
            passed_reasons.append("No restrictive annual income ceiling")
        else:
            if user_annual_income <= scheme.max_annual_income:
                passed_reasons.append(
                    f"Annual income (₹{user_annual_income:,.0f}) is within limit of ₹{scheme.max_annual_income:,.0f}"
                )
            else:
                missing_requirements.append(
                    f"Annual income (₹{user_annual_income:,.0f}) exceeds threshold of ₹{scheme.max_annual_income:,.0f}"
                )

        # Calculate final deterministic score
        passed_count = len(passed_reasons)
        is_eligible = len(missing_requirements) == 0

        if is_eligible:
            match_score = 100.0
        else:
            match_score = round((passed_count / float(total_criteria_count)) * 100.0, 1)

        return {
            "match_score": match_score,
            "is_eligible": is_eligible,
            "eligibility_reasons": passed_reasons,
            "missing_requirements": missing_requirements,
        }
