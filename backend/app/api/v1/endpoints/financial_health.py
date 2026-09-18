"""
Sakhi Financial Health API Endpoints.

Provides deterministic financial health summaries, ratios, and surplus analysis.
"""

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.errors import ResourceNotFoundException
from app.schemas.finance import FinancialSummaryResponse
from app.services.user_service import UserService
from app.services.financial_engine import FinancialEngine

router = APIRouter(tags=["Financial Health & Calculations"])


@router.get(
    "/users/{user_id}/financial-health",
    response_model=FinancialSummaryResponse,
    summary="Get Financial Health Summary",
    description="Calculate and return the complete deterministic financial overview, surplus, emergency buffer, and health category for a user."
)
def get_financial_health(
    user_id: int,
    db: Session = Depends(get_db)
) -> FinancialSummaryResponse:
    """Retrieve deterministic financial health overview for a user."""
    user = UserService.get_user_by_id(db=db, user_id=user_id)
    if not user:
        raise ResourceNotFoundException(message=f"User with ID {user_id} not found")
    return FinancialEngine.calculate_financial_health(db=db, user=user)
