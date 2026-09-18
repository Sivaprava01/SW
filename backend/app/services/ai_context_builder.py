"""
Sakhi AI Financial Grounding Context Builder.

Gathers deterministic user metrics (income, surplus, 3-month emergency buffer,
moneylender debts, savings goals, journey stage, matched schemes) to assemble
a grounded, accurate context payload for LLM prompt injection.
"""

from typing import Dict, Any, List, Optional
from sqlalchemy.orm import Session
from app.models.user import User
from app.services.user_service import UserService
from app.services.financial_engine import FinancialEngine
from app.services.goal_service import GoalService
from app.services.debt_service import DebtService
from app.services.journey_engine import JourneyEngine
from app.services.scheme_service import SchemeService
from app.schemas.ai import GroundingMetrics


class AIContextBuilder:
    """Builds grounded financial context dictionaries and LLM prompt context."""

    @classmethod
    def build_grounding_context(cls, db: Session, user_id: int) -> Optional[Dict[str, Any]]:
        """Gather all deterministic financial metrics for a user."""
        user = UserService.get_user_by_id(db=db, user_id=user_id)
        if not user:
            return None

        # 1. Financial Health & Cashflow
        fin_summary = FinancialEngine.calculate_financial_health(db=db, user=user)
        
        # 2. Debt & Refinancing
        all_debts = DebtService.get_user_debts(db=db, user_id=user_id)
        debts = [d for d in all_debts if not d.is_cleared]
        snowball_analysis = DebtService.calculate_snowball_analysis(db=db, user=user)
        
        # 3. Goals
        all_goals = GoalService.get_user_goals(db=db, user_id=user_id)
        goals = [g for g in all_goals if not g.is_completed]
        
        # 4. 7-Stage Journey Roadmap
        journey = JourneyEngine.calculate_journey_roadmap(db=db, user=user)
        current_stage = next((s for s in journey.stages if s.stage_number == journey.current_active_stage), journey.stages[0])

        # 5. Matched Government Schemes
        matched_schemes = SchemeService.get_matched_schemes_for_user(db=db, user_id=user_id)
        eligible_schemes = [s for s in matched_schemes if s.is_eligible]

        # Assemble GroundingMetrics schema
        metrics = GroundingMetrics(
            user_name=user.name,
            monthly_income=fin_summary.monthly_income,
            monthly_expenses=fin_summary.monthly_expenses,
            monthly_surplus=fin_summary.monthly_surplus,
            savings_ratio_percentage=fin_summary.savings_ratio,
            current_savings=fin_summary.total_savings,
            emergency_fund_target=fin_summary.emergency_target,
            emergency_fund_progress_percentage=fin_summary.emergency_progress_percentage,
            total_debt=snowball_analysis.total_debt_balance,
            monthly_interest_drain=snowball_analysis.total_monthly_interest_drain,
            active_goals_count=len(goals),
            current_stage=journey.current_active_stage,
            current_stage_title=current_stage.title.en,
            matched_schemes_count=len(eligible_schemes),
            is_shg_member=user.is_shg_member,
        )




        return {
            "user": user,
            "metrics": metrics,
            "fin_summary": fin_summary,
            "debts": debts,
            "snowball_analysis": snowball_analysis,
            "goals": goals,
            "current_stage": current_stage,
            "eligible_schemes": eligible_schemes,
        }

    @classmethod
    def format_grounding_prompt(cls, context: Dict[str, Any]) -> str:
        """Format the gathered context into a structured grounding prompt string."""
        user: User = context["user"]
        m: GroundingMetrics = context["metrics"]
        debts = context["debts"]
        goals = context["goals"]
        schemes = context["eligible_schemes"]

        debt_lines = []
        for d in debts:
            debt_lines.append(
                f"- {d.lender_name} ({d.lender_type}): Balance ₹{d.current_balance:,.0f} at {d.annual_interest_rate:.1f}% APR (EMI: ₹{d.monthly_emi_payment:,.0f}/mo)"
            )
        if debt_lines:
            debt_str = "\n".join(debt_lines)
        elif m.total_debt > 0:
            debt_str = f"- Total Debt on Profile: ₹{m.total_debt:,.0f} (Individual loan breakdown not yet logged by user in debt tracker)"
        else:
            debt_str = "None (₹0 active debt)"

        goal_lines = []
        for g in goals:
            goal_lines.append(
                f"- {g.name}: Target ₹{g.target_amount:,.0f}, Saved ₹{g.current_amount:,.0f} (Remaining: ₹{g.remaining_amount:,.0f})"
            )
        goal_str = "\n".join(goal_lines) if goal_lines else "None (No specific goals logged yet)"

        scheme_lines = []
        for s in schemes[:4]:
            scheme_lines.append(
                f"- {s.short_name} ({s.name}): {s.benefit_amount_display} (Cost: {s.cost_or_premium})"
            )
        scheme_str = "\n".join(scheme_lines) if scheme_lines else "No specific state schemes matched"

        return f"""
### USER PROFILE & DEMOGRAPHICS:
- Name: {user.name}
- Age: {user.age} years | Gender: {user.gender.capitalize()}
- Location: {user.locality_type.capitalize()} area, {user.state}
- SHG Membership: {"Yes (" + (user.shg_name or "Active Sangham") + ")" if user.is_shg_member else "No (Individual)"}
- Occupation: {user.occupation or "Self-Employed"}

### AUTHORITATIVE LIVE FINANCIAL FACTS (MANDATORY TRUTH - NEVER CONTRADICT OR INVENT):
- Monthly Income: ₹{m.monthly_income:,.0f}
- Monthly Expenses: ₹{m.monthly_expenses:,.0f}
- Disposable Monthly Surplus: ₹{m.monthly_surplus:,.0f}
- Current Savings Balance: ₹{m.current_savings:,.0f}
- 3-Month Emergency Shield Buffer Target: ₹{m.emergency_fund_target:,.0f} (Progress: {m.emergency_fund_progress_percentage:.1f}%)
- Total Outstanding Debt: ₹{m.total_debt:,.0f} (Monthly Interest Drain: ₹{m.monthly_interest_drain:,.0f}/mo)
- Current Roadmap Stage: Stage {m.current_stage} — {m.current_stage_title}

### RECORDED DEBTS & LIABILITIES:
{debt_str}

### SAVINGS GOALS:
{goal_str}

### MATCHED 100% ELIGIBLE GOVERNMENT SCHEMES:
{scheme_str}
""".strip()

