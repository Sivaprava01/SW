import math
from datetime import datetime
from typing import Dict, Any, List, Optional
from sqlalchemy.orm import Session
from app.models.user import User
from app.models.transaction import Transaction
from app.models.goal import Goal

JOURNEY_STAGES = [
    {
        "id": 1,
        "name": "Track Income & Expenses",
        "description": "Know exactly where your money comes from and where it goes every month.",
        "icon": "ReceiptText"
    },
    {
        "id": 2,
        "name": "Build Emergency Fund",
        "description": "Save 3 to 6 months of living expenses for unexpected medical or family needs.",
        "icon": "ShieldAlert"
    },
    {
        "id": 3,
        "name": "Manage & Clear Debt",
        "description": "Repay high-interest loans systematically so interest doesn't eat your hard work.",
        "icon": "TrendingDown"
    },
    {
        "id": 4,
        "name": "Build Savings",
        "description": "Accumulate dedicated savings for personal and family dreams in safe accounts.",
        "icon": "PiggyBank"
    },
    {
        "id": 5,
        "name": "Protect Family",
        "description": "Secure government/micro-insurance for health, life, and disability.",
        "icon": "HeartHandshake"
    },
    {
        "id": 6,
        "name": "Long-Term Investing",
        "description": "Put small amounts into PPF, Sukanya Samriddhi, or disciplined growth avenues.",
        "icon": "LineChart"
    },
    {
        "id": 7,
        "name": "Financial Independence",
        "description": "Own your financial freedom with recurring passive stability and peace of mind.",
        "icon": "Sparkles"
    }
]

def calculate_monthly_surplus(income: float, expenses: float) -> float:
    """Surplus = Income - Expenses"""
    return round(float(income) - float(expenses), 2)

def calculate_goal_metrics(
    target_amount: float,
    current_amount: float,
    target_date_str: str
) -> Dict[str, Any]:
    """
    Calculates remaining goal amount, months left, required monthly savings,
    and completion percentage deterministically.
    """
    remaining = max(0.0, float(target_amount) - float(current_amount))
    percent_complete = 100.0 if target_amount <= 0 else min(100.0, round((current_amount / target_amount) * 100, 1))

    # Calculate months remaining
    months_left = 12  # Default to 12 months if duration parsing fails
    try:
        if target_date_str.isdigit():
            months_left = max(1, int(target_date_str))
        else:
            # Try parsing YYYY-MM-DD
            target_dt = datetime.strptime(target_date_str[:10], "%Y-%m-%d")
            now = datetime.utcnow()
            diff_days = (target_dt - now).days
            months_left = max(1, math.ceil(diff_days / 30.44))
    except Exception:
        months_left = 12

    required_monthly = round(remaining / months_left, 2) if remaining > 0 else 0.0

    return {
        "target_amount": round(float(target_amount), 2),
        "current_amount": round(float(current_amount), 2),
        "remaining_amount": round(remaining, 2),
        "months_remaining": months_left,
        "monthly_saving_required": required_monthly,
        "percent_complete": percent_complete
    }

def calculate_emergency_fund_metrics(monthly_expenses: float, current_savings: float) -> Dict[str, Any]:
    """
    Calculates recommended 3-month emergency fund target and progress.
    """
    target = round(monthly_expenses * 3, 2)
    if target <= 0:
        target = 15000.0  # Safe minimum fallback for rural baseline
    
    current = round(float(current_savings), 2)
    remaining = max(0.0, round(target - current, 2))
    percent = 100.0 if target <= 0 else min(100.0, round((current / target) * 100, 1))

    return {
        "target": target,
        "current": current,
        "remaining": remaining,
        "percent_complete": percent,
        "target_months": 3
    }

def calculate_user_totals(db: Session, user: User) -> Dict[str, float]:
    """
    Calculates effective total income and expenses. If user logged transactions,
    computes from transactions or uses baseline user fields.
    """
    txs = db.query(Transaction).filter(Transaction.user_id == user.id).all()
    
    tx_income = sum(t.amount for t in txs if t.type == "income")
    tx_expense = sum(t.amount for t in txs if t.type == "expense")

    # If transactions are present, use the larger of logged transactions or baseline
    total_income = max(user.monthly_income, tx_income) if user.monthly_income > 0 else tx_income
    total_expense = max(user.monthly_expenses, tx_expense) if user.monthly_expenses > 0 else tx_expense

    surplus = calculate_monthly_surplus(total_income, total_expense)

    return {
        "total_income": round(total_income, 2),
        "total_expense": round(total_expense, 2),
        "surplus": surplus,
        "savings": round(user.savings, 2),
        "debt": round(user.debt, 2)
    }

def determine_journey_stage(db: Session, user: User) -> Dict[str, Any]:
    """
    Evaluates where the user stands in the 7-stage financial journey:
    1. Track Income & Expenses: Completed if income & expenses are tracked (> 0).
    2. Build Emergency Fund: Target is 3 months expenses. Active if savings < 3x expenses.
    3. Manage / Clear Debt: Active if user has outstanding debt > 0.
    4. Build Savings: Active if debt is cleared and savings < 6x expenses or goal in progress.
    5. Protect Family: Active when savings > 3 months, insurance needed.
    6. Long-Term Investing: Active when baseline safety is in place.
    7. Financial Independence: Reached when savings > 12x expenses and debt is 0.
    """
    totals = calculate_user_totals(db, user)
    monthly_exp = totals["total_expense"]
    current_savings = totals["savings"]
    debt = totals["debt"]

    # Evaluation
    stage_1_done = totals["total_income"] > 0 and monthly_exp > 0
    emergency_target = monthly_exp * 3 if monthly_exp > 0 else 15000.0
    stage_2_done = stage_1_done and (current_savings >= emergency_target)
    stage_3_done = stage_2_done and (debt <= 0)
    stage_4_done = stage_3_done and (current_savings >= emergency_target * 2)
    stage_5_done = stage_4_done and (current_savings >= emergency_target * 2.5)
    stage_6_done = stage_5_done and (current_savings >= emergency_target * 3)

    if not stage_1_done:
        current_stage_id = 1
    elif not stage_2_done:
        current_stage_id = 2
    elif not stage_3_done:
        current_stage_id = 3
    elif not stage_4_done:
        current_stage_id = 4
    elif not stage_5_done:
        current_stage_id = 5
    elif not stage_6_done:
        current_stage_id = 6
    else:
        current_stage_id = 7

    current_stage_meta = next(s for s in JOURNEY_STAGES if s["id"] == current_stage_id)
    next_stage_meta = next((s for s in JOURNEY_STAGES if s["id"] == current_stage_id + 1), None)

    # Calculate milestone details
    milestone_target = 0.0
    milestone_current = 0.0
    action_title = ""
    action_desc = ""

    if current_stage_id == 1:
        milestone_target = 1.0
        milestone_current = 0.5 if totals["total_income"] > 0 or monthly_exp > 0 else 0.0
        action_title = "Log Your Regular Income & Expenses"
        action_desc = "Add your daily grocery, shop, or agricultural sales to see your exact monthly balance."
    elif current_stage_id == 2:
        milestone_target = emergency_target
        milestone_current = min(current_savings, emergency_target)
        action_title = f"Save ₹{int(emergency_target - current_savings):,} for Your Suraksha Kavach (Emergency Fund)"
        action_desc = f"Keep at least 3 months of expenses (₹{int(emergency_target):,}) in a secure bank account or Post Office."
    elif current_stage_id == 3:
        milestone_target = debt
        milestone_current = 0.0
        action_title = f"Reduce Your ₹{int(debt):,} Debt"
        action_desc = "Use ₹2,000 to ₹3,000 of your monthly surplus to pay off high-interest informal loans first."
    elif current_stage_id == 4:
        milestone_target = emergency_target * 2
        milestone_current = current_savings
        action_title = "Fund Your Personal Savings Goals"
        action_desc = "Set aside a fixed amount every month in a recurring deposit or post office savings account."
    elif current_stage_id == 5:
        milestone_target = 100.0
        milestone_current = 20.0
        action_title = "Enroll in Government Micro-Insurance"
        action_desc = "Get PMSBY (₹20/yr accident cover) and PMJJBY (₹436/yr life cover) from your local bank branch."
    elif current_stage_id == 6:
        milestone_target = 100.0
        milestone_current = 50.0
        action_title = "Start Long-Term Disciplined Growth"
        action_desc = "Explore Sukanya Samriddhi Yojana for daughters or Mahila Samman Savings Certificate."
    else:
        milestone_target = 100.0
        milestone_current = 100.0
        action_title = "Maintain Your Financial Independence"
        action_desc = "Keep your emergency reserves healthy and review your household finances periodically."

    progress_percent = round((current_stage_id - 1) / len(JOURNEY_STAGES) * 100, 1)

    return {
        "current_stage_id": current_stage_id,
        "current_stage_name": current_stage_meta["name"],
        "current_stage_description": current_stage_meta["description"],
        "progress_percent": progress_percent,
        "next_stage": next_stage_meta["name"] if next_stage_meta else "Financial Freedom Reached",
        "action_title": action_title,
        "action_description": action_desc,
        "milestone_target": milestone_target,
        "milestone_current": milestone_current,
        "stages": [
            {
                **s,
                "is_completed": s["id"] < current_stage_id,
                "is_current": s["id"] == current_stage_id
            }
            for s in JOURNEY_STAGES
        ]
    }

def get_financial_health_summary(db: Session, user: User) -> Dict[str, Any]:
    """
    Returns complete deterministically calculated financial health summary.
    """
    totals = calculate_user_totals(db, user)
    emergency = calculate_emergency_fund_metrics(totals["total_expense"], totals["savings"])
    journey = determine_journey_stage(db, user)

    # Goals
    goals = db.query(Goal).filter(Goal.user_id == user.id).all()
    enriched_goals = []
    for g in goals:
        metrics = calculate_goal_metrics(g.target_amount, g.current_amount, g.target_date)
        enriched_goals.append({
            "id": g.id,
            "name": g.name,
            "category": g.category,
            "target_amount": metrics["target_amount"],
            "current_amount": metrics["current_amount"],
            "remaining_amount": metrics["remaining_amount"],
            "months_remaining": metrics["months_remaining"],
            "monthly_saving_required": metrics["monthly_saving_required"],
            "percent_complete": metrics["percent_complete"],
            "target_date": g.target_date
        })

    primary_goal = enriched_goals[0] if enriched_goals else None

    return {
        "user_id": user.id,
        "name": user.name,
        "monthly_income": totals["total_income"],
        "monthly_expenses": totals["total_expense"],
        "surplus": totals["surplus"],
        "savings": totals["savings"],
        "debt": totals["debt"],
        "emergency_fund": emergency,
        "journey": journey,
        "goals": enriched_goals,
        "primary_goal": primary_goal
    }
