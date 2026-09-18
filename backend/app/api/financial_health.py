from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.services.financial_engine import get_financial_health_summary

router = APIRouter(prefix="/api/financial-health", tags=["Financial Health"])

@router.get("/{user_id}")
def get_financial_health(user_id: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    summary = get_financial_health_summary(db, user)
    return summary
