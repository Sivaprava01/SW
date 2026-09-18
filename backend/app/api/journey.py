from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.services.financial_engine import determine_journey_stage

router = APIRouter(prefix="/api/journey", tags=["Journey"])

@router.get("/{user_id}")
def get_user_journey(user_id: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    journey_state = determine_journey_stage(db, user)
    return journey_state
