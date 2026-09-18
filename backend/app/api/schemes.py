from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.models.scheme import GovernmentScheme
from app.models.user import User
from app.schemas.scheme import SchemeResponse, SchemeMatchRequest, SchemeMatchResponse
from app.services.scheme_matcher import match_schemes, match_schemes_for_user, DISCLAIMER_TEXT

router = APIRouter(prefix="/api/schemes", tags=["Government Schemes"])

@router.get("", response_model=List[SchemeResponse])
def get_all_schemes(
    category: Optional[str] = Query(None),
    state: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    query = db.query(GovernmentScheme)
    if category and category != "All":
        query = query.filter(GovernmentScheme.category.ilike(f"%{category}%"))
    if state and state != "All":
        query = query.filter((GovernmentScheme.state == state) | (GovernmentScheme.state == "Central"))
    return query.all()

@router.get("/match/user/{user_id}", response_model=SchemeMatchResponse)
def get_schemes_matched_for_user(user_id: str, db: Session = Depends(get_db)):
    """Matches schemes automatically based on the user's stored profile attributes."""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    matches = match_schemes_for_user(db, user)
    return SchemeMatchResponse(
        matches=matches,
        total_matched=len(matches),
        disclaimer=DISCLAIMER_TEXT
    )

@router.get("/{scheme_id}", response_model=SchemeResponse)
def get_scheme_by_id(scheme_id: str, db: Session = Depends(get_db)):
    scheme = db.query(GovernmentScheme).filter(GovernmentScheme.id == scheme_id).first()
    if not scheme:
        raise HTTPException(status_code=404, detail="Government scheme not found")
    return scheme

@router.post("/match", response_model=SchemeMatchResponse)
def match_user_schemes(request: SchemeMatchRequest, db: Session = Depends(get_db)):
    matches = match_schemes(db, request)
    return SchemeMatchResponse(
        matches=matches,
        total_matched=len(matches),
        disclaimer=DISCLAIMER_TEXT
    )
