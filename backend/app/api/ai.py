import logging
from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from app.config import settings
from app.database import get_db
from app.models.user import User
from app.schemas.ai import AIChatRequest, AIChatResponse, FinancialContextPayload
from app.services.financial_engine import get_financial_health_summary
from app.services.gemini_service import gemini_service
from app.core.rate_limiter import RateLimit

logger = logging.getLogger("sakhi.ai")

router = APIRouter(prefix="/api/ai", tags=["Ask Sakhi AI"])

@router.post(
    "/chat",
    response_model=AIChatResponse,
    dependencies=[Depends(RateLimit(settings.AI_RATE_LIMIT, settings.AI_RATE_WINDOW_SECONDS, "ai"))]
)
async def chat_with_sakhi(
    req: AIChatRequest,
    request: Request,
    db: Session = Depends(get_db)
):
    """
    AI Financial Assistant endpoint:
    1. Deterministic financial engine calculates 100% accurate metrics.
    2. Constructs structured context.
    3. Dedicated Gemini Service generates a warm, grounded multilingual explanation.
    Protected by configurable rate limiting.
    """
    user = db.query(User).filter(User.id == req.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Step 1: Financial Engine calculates authoritative deterministic metrics
    summary = get_financial_health_summary(db, user)

    # Step 2: Form structured financial context
    primary_goal_dict = None
    if summary["primary_goal"]:
        g = summary["primary_goal"]
        primary_goal_dict = {
            "name": g["name"],
            "target_amount": g["target_amount"],
            "current_amount": g["current_amount"],
            "remaining_amount": g["remaining_amount"],
            "monthly_saving_required": g["monthly_saving_required"]
        }

    user_lang = req.language or user.preferred_language or "en" if hasattr(user, "preferred_language") else (req.language or "en")
    context = FinancialContextPayload(
        name=user.name,
        income=summary["monthly_income"],
        expenses=summary["monthly_expenses"],
        surplus=summary["surplus"],
        savings=summary["savings"],
        debt=summary["debt"],
        current_journey_stage=summary["journey"]["current_stage_name"],
        emergency_fund=summary["emergency_fund"],
        primary_goal=primary_goal_dict,
        state=user.state or "All India",
        age=user.age or 30,
        is_shg_member=bool(user.is_shg_member),
        language=user_lang
    )

    # Step 3: Dedicated Gemini Service generates grounded explanation
    response = await gemini_service.generate_explanation(
        user_message=req.message,
        context=context,
        language=user_lang
    )

    return response
