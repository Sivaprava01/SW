"""
Sakhi 7-Stage Financial Empowerment Journey API Endpoints.

Calculates dynamic user milestone progression across the 7 stages of financial freedom.
"""

from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.errors import ResourceNotFoundException
from app.schemas.journey import JourneyRoadmapResponse
from app.services.user_service import UserService
from app.services.journey_engine import JourneyEngine

router = APIRouter(tags=["7-Stage Financial Journey"])


@router.get(
    "/users/{user_id}/journey",
    response_model=JourneyRoadmapResponse,
    summary="Get 7-Stage Financial Journey Roadmap",
    description="Deterministically calculates the user's progress across all 7 stages based on actual balances, debt, and savings data."
)
def get_user_journey(
    user_id: int,
    db: Session = Depends(get_db)
) -> JourneyRoadmapResponse:
    """Retrieve the 7-stage roadmap evaluated against user data."""
    user = UserService.get_user_by_id(db=db, user_id=user_id)
    if not user:
        raise ResourceNotFoundException(message=f"User with ID {user_id} not found")
    return JourneyEngine.calculate_journey_roadmap(db=db, user=user)
