from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.schemas.ai import AIChatRequest, AIChatResponse, FinancialContextPayload
from app.services.financial_engine import get_financial_health_summary
from app.services.ai_service import explain_finances_with_ai

router = APIRouter(prefix="/api/ai", tags=["Ask Sakhi AI"])

@router.post("/chat", response_model=AIChatResponse)
async def chat_with_sakhi(req: AIChatRequest, db: Session = Depends(get_db)):
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

    user_lang = req.language or user.preferred_language or "en"
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

    # Step 3: AI Service generates friendly, simple, grounded explanation
    response = await explain_finances_with_ai(
        user_message=req.message,
        context=context,
        language=user_lang
    )

    return response
