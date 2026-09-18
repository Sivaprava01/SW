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
    target = max(0.0, float(target_amount or 0.0))
    current = max(0.0, float(current_amount or 0.0))
    remaining = max(0.0, target - current)
    percent_complete = 100.0 if target <= 0 else min(100.0, round((current / target) * 100, 1))

    # Calculate months remaining
    months_left = 12
    try:
        if str(target_date_str).isdigit():
            months_left = max(1, int(target_date_str))
        else:
            target_dt = datetime.strptime(str(target_date_str)[:10], "%Y-%m-%d")
            now = datetime.utcnow()
            diff_days = (target_dt - now).days
            months_left = max(1, math.ceil(diff_days / 30.44))
    except Exception:
        months_left = 12

    required_monthly = round(remaining / months_left, 2) if remaining > 0 else 0.0

    return {
        "target_amount": round(target, 2),
        "current_amount": round(current, 2),
        "remaining_amount": round(remaining, 2),
        "months_remaining": months_left,
        "monthly_saving_required": required_monthly,
        "percent_complete": percent_complete
    }

def calculate_emergency_fund_metrics(monthly_expenses: float, current_savings: float) -> Dict[str, Any]:
    """
    Calculates recommended 3-month emergency fund target and progress.
    Target = 3 x Monthly Expenses (min ₹15,000 for safety baseline).
    """
    expenses = float(monthly_expenses or 0.0)
    target = round(expenses * 3, 2) if expenses > 0 else 15000.0
    current = max(0.0, float(current_savings or 0.0))
    remaining = max(0.0, round(target - current, 2))
    percent = 100.0 if target <= 0 else min(100.0, round((current / target) * 100, 1))

    return {
        "target": target,
        "current": round(current, 2),
        "remaining": remaining,
        "percent_complete": percent,
        "target_months": 3,
        "is_fully_funded": current >= target
    }

def calculate_user_totals(db: Session, user: User) -> Dict[str, float]:
    """
    Calculates effective total income and expenses. Combines declared baseline
    profile income/expenses with logged transactions seamlessly.
    """
    txs = db.query(Transaction).filter(Transaction.user_id == user.id).all()
    
    tx_income = sum(t.amount for t in txs if t.type == "income")
    tx_expense = sum(t.amount for t in txs if t.type == "expense")

    total_income = float(user.monthly_income or 0.0) + float(tx_income)
    total_expense = float(user.monthly_expenses or 0.0) + float(tx_expense)

    surplus = calculate_monthly_surplus(total_income, total_expense)

    return {
        "total_income": round(total_income, 2),
        "total_expense": round(total_expense, 2),
        "surplus": surplus,
        "savings": round(float(user.savings or 0.0), 2),
        "debt": round(float(user.debt or 0.0), 2)
    }

def determine_journey_stage(db: Session, user: User) -> Dict[str, Any]:
    """
    Evaluates where the user stands in the 7-stage financial journey:
    Stage 1. Track Income & Expenses: Completed when income & expenses > 0.
    Stage 2. Build Emergency Fund: Target is 3 months expenses. Completed when savings >= 3x expenses.
    Stage 3. Manage & Clear Debt: Completed when debt <= 0.
    Stage 4. Build Savings: Completed when savings >= 6x expenses.
    Stage 5. Protect Family: Micro-insurance protection in place.
    Stage 6. Long-Term Investing: Savings >= 9x expenses.
    Stage 7. Financial Independence: Savings >= 12x expenses and zero debt.
    """
    totals = calculate_user_totals(db, user)
    monthly_exp = totals["total_expense"]
    current_savings = totals["savings"]
    debt = totals["debt"]

    emergency_target = monthly_exp * 3 if monthly_exp > 0 else 15000.0

    stage_1_done = totals["total_income"] > 0 and monthly_exp > 0
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

    # Actionable guidance specific to stage
    if current_stage_id == 1:
        action_title = "Log Your Regular Income & Expenses"
        action_desc = "Add your daily grocery, shop, or agricultural sales to see your exact monthly balance."
        milestone_target = 1.0
        milestone_current = 0.5 if totals["total_income"] > 0 or monthly_exp > 0 else 0.0
    elif current_stage_id == 2:
        rem = max(0, emergency_target - current_savings)
        action_title = f"Save ₹{int(rem):,} for Your Suraksha Kavach (Emergency Fund)"
        action_desc = f"Keep at least 3 months of living expenses (₹{int(emergency_target):,}) safe in a bank or Post Office."
        milestone_target = emergency_target
        milestone_current = min(current_savings, emergency_target)
    elif current_stage_id == 3:
        suggested_repay = min(totals["surplus"], max(1000.0, round(totals["surplus"] * 0.6, 2))) if totals["surplus"] > 0 else 500.0
        action_title = f"Reduce Your ₹{int(debt):,} Debt"
        action_desc = f"Use ~₹{int(suggested_repay):,}/month of your surplus to pay off high-interest informal loans first."
        milestone_target = debt
        milestone_current = 0.0
    elif current_stage_id == 4:
        action_title = "Fund Your Personal Savings Goals"
        action_desc = "Set aside a fixed amount every month in a recurring deposit or post office savings account."
        milestone_target = emergency_target * 2
        milestone_current = current_savings
    elif current_stage_id == 5:
        action_title = "Enroll in Government Micro-Insurance"
        action_desc = "Get PMSBY (₹20/yr accident cover) and PMJJBY (₹436/yr life cover) from your local bank branch."
        milestone_target = 100.0
        milestone_current = 20.0
    elif current_stage_id == 6:
        action_title = "Start Long-Term Disciplined Growth"
        action_desc = "Explore Sukanya Samriddhi Yojana for daughters or Mahila Samman Savings Certificate."
        milestone_target = 100.0
        milestone_current = 50.0
    else:
        action_title = "Maintain Your Financial Independence"
        action_desc = "Keep your emergency reserves healthy and review your household finances periodically."
        milestone_target = 100.0
        milestone_current = 100.0

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
    Returns complete deterministically calculated financial health summary,
    including surplus, savings rate, debt burden, emergency fund metrics, and goal progress.
    """
    totals = calculate_user_totals(db, user)
    emergency = calculate_emergency_fund_metrics(totals["total_expense"], totals["savings"])
    journey = determine_journey_stage(db, user)

    # Goals calculation
    goals = db.query(Goal).filter(Goal.user_id == user.id).all()
    enriched_goals = []
    total_goals_monthly = 0.0
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
        total_goals_monthly += metrics["monthly_saving_required"]

    primary_goal = enriched_goals[0] if enriched_goals else None

    # Savings Rate & Debt Burden formulas
    income = totals["total_income"]
    surplus = totals["surplus"]
    debt = totals["debt"]
    
    savings_rate = round((surplus / income * 100), 1) if income > 0 and surplus > 0 else 0.0
    annual_income = income * 12
    debt_burden_percent = round((debt / annual_income * 100), 1) if annual_income > 0 else 0.0
    unallocated_surplus = max(0.0, round(surplus - total_goals_monthly, 2))

    total_goal_savings = sum(g.current_amount for g in goals)
    unallocated_savings = max(0.0, round(totals["savings"] - total_goal_savings, 2))

    # Health Badge & Label determination
    if debt > 0 and surplus <= 0:
        health_status = "High Debt Deficit"
        health_badge = "warning"
    elif not emergency["is_fully_funded"]:
        health_status = "Building Safety Shield"
        health_badge = "needs_action"
    elif debt > 0:
        health_status = "Shield Ready - Repay Debt"
        health_badge = "needs_action"
    elif surplus > 0:
        health_status = "Healthy & Growing"
        health_badge = "healthy"
    else:
        health_status = "Stable Baseline"
        health_badge = "neutral"

    return {
        "user_id": user.id,
        "name": user.name,
        "monthly_income": totals["total_income"],
        "monthly_expenses": totals["total_expense"],
        "surplus": surplus,
        "savings": totals["savings"],
        "debt": totals["debt"],
        "savings_rate_percent": savings_rate,
        "debt_burden_percent": debt_burden_percent,
        "unallocated_surplus": unallocated_surplus,
        "total_goal_savings": round(total_goal_savings, 2),
        "unallocated_savings": unallocated_savings,
        "health_status": health_status,
        "health_badge": health_badge,
        "emergency_fund": emergency,
        "journey": journey,
        "goals": enriched_goals,
        "total_goals_monthly_saving": round(total_goals_monthly, 2),
        "primary_goal": primary_goal
    }
