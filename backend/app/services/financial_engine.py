"""
Sakhi Deterministic Financial Calculation Engine.

Implements all core mathematical formulas for monthly surplus, savings ratio,
emergency buffer benchmarks, and health categorization.
Zero speculative or hallucinated financial figures.
"""

from typing import List
from sqlalchemy.orm import Session
from sqlalchemy import select
from app.models.user import User
from app.models.transaction import Transaction
from app.schemas.finance import CategoryBreakdown, FinancialSummaryResponse


class FinancialEngine:
    """Pure deterministic financial calculation engine."""

    @staticmethod
    def calculate_financial_health(db: Session, user: User) -> FinancialSummaryResponse:
        """
        Calculate complete deterministic financial overview for a given user.
        Uses logged transactions if present; otherwise defaults to user baseline snapshot.
        """
        # 1. Fetch all user transactions
        stmt = select(Transaction).where(Transaction.user_id == user.id)
        transactions: List[Transaction] = list(db.execute(stmt).scalars().all())

        income_txs = [t for t in transactions if t.type == "income"]
        expense_txs = [t for t in transactions if t.type == "expense"]

        # 2. Determine monthly income & expenses
        if income_txs:
            monthly_income = sum(t.amount for t in income_txs)
        else:
            monthly_income = float(user.monthly_income)

        if expense_txs:
            monthly_expenses = sum(t.amount for t in expense_txs)
        else:
            monthly_expenses = float(user.monthly_expenses)

        # 3. Deterministic Disposable Monthly Surplus
        monthly_surplus = max(0.0, monthly_income - monthly_expenses)

        # 4. Financial Ratios
        if monthly_income > 0:
            savings_ratio = round((monthly_surplus / monthly_income) * 100.0, 1)
            expense_ratio = round((monthly_expenses / monthly_income) * 100.0, 1)
        else:
            savings_ratio = 0.0
            expense_ratio = 100.0 if monthly_expenses > 0 else 0.0

        # 5. Emergency Safety Buffer (3 months of essential living expenses)
        emergency_target = round(monthly_expenses * 3.0, 2)
        total_savings = float(user.initial_savings)

        if emergency_target > 0:
            emergency_progress = min(100.0, round((total_savings / emergency_target) * 100.0, 1))
        else:
            emergency_progress = 100.0 if total_savings > 0 else 0.0

        # 6. Financial Health Categorization
        if monthly_income <= 0 or monthly_expenses > monthly_income:
            health_status = "Negative Cashflow / Deficit"
        elif savings_ratio >= 30.0:
            health_status = "Healthy Surplus"
        else:
            health_status = "Tight Budget"

        # 7. Plain-Language Localized Health Summary
        health_summary = FinancialEngine._build_health_summary(
            name=user.name,
            language=user.primary_language,
            income=monthly_income,
            expenses=monthly_expenses,
            surplus=monthly_surplus,
            health_status=health_status,
            emergency_progress=emergency_progress,
        )

        # 8. Category Breakdown Aggregation
        expense_breakdown = FinancialEngine._build_category_breakdown(expense_txs, monthly_expenses)
        income_breakdown = FinancialEngine._build_category_breakdown(income_txs, monthly_income)

        return FinancialSummaryResponse(
            user_id=user.id,
            user_name=user.name,
            primary_language=user.primary_language,
            monthly_income=round(monthly_income, 2),
            monthly_expenses=round(monthly_expenses, 2),
            monthly_surplus=round(monthly_surplus, 2),
            savings_ratio=savings_ratio,
            expense_ratio=expense_ratio,
            total_savings=round(total_savings, 2),
            total_debt=round(float(user.initial_debt), 2),
            emergency_target=emergency_target,
            emergency_progress_percentage=emergency_progress,
            health_status=health_status,
            health_summary=health_summary,
            expense_breakdown=expense_breakdown,
            income_breakdown=income_breakdown,
        )

    @staticmethod
    def _build_category_breakdown(transactions: List[Transaction], total_amount: float) -> List[CategoryBreakdown]:
        """Aggregate transaction amounts by category and compute percentages."""
        if not transactions or total_amount <= 0:
            return []

        cat_totals = {}
        for t in transactions:
            cat_totals[t.category] = cat_totals.get(t.category, 0.0) + t.amount

        breakdown = []
        for cat, amount in sorted(cat_totals.items(), key=lambda item: item[1], reverse=True):
            pct = round((amount / total_amount) * 100.0, 1)
            breakdown.append(CategoryBreakdown(category=cat, total_amount=round(amount, 2), percentage=pct))
        return breakdown

    @staticmethod
    def _build_health_summary(
        name: str,
        language: str,
        income: float,
        expenses: float,
        surplus: float,
        health_status: str,
        emergency_progress: float,
    ) -> str:
        """Construct a culturally appropriate, simple health summary."""
        if language == "te":
            if health_status == "Healthy Surplus":
                return f"నమస్తే {name} గారు! మీ నెలవారీ ఆదాయం ₹{int(income):,} లో ₹{int(surplus):,} మిగులు ఉంది. ఇది చాలా ఆరోగ్యకరమైన పరిస్థితి. ఈ మిగులుతో అత్యవసర నిధిని మరియు పొదుపు లక్ష్యాలను బలోపేతం చేయండి."
            elif health_status == "Tight Budget":
                return f"నమస్తే {name} గారు! మీ ఖర్చులు ₹{int(expenses):,} పోగా ₹{int(surplus):,} మిగులు ఉంది. చిన్న పొదుపుతో అత్యవసర రక్షణ నిధిని నిర్మించడం ప్రారంభించండి."
            else:
                return f"నమస్తే {name} గారు! మీ ఖర్చులు ఆదాయాన్ని మించి ఉన్నాయి. అధిక వడ్డీ అప్పులను తగ్గించి, ఖర్చులను సమీక్షించండి."
        elif language == "hi":
            if health_status == "Healthy Surplus":
                return f"नमस्ते {name} जी! आपकी ₹{int(income):,} की मासिक आय में से ₹{int(surplus):,} की बचत हो रही है। यह बहुत अच्छी स्थिति है। इससे अपने आपातकालीन कोष को मजबूत करें।"
            elif health_status == "Tight Budget":
                return f"नमस्ते {name} जी! आपकी मासिक बचत ₹{int(surplus):,} है। नियमित छोटी बचत से अपने परिवार का सुरक्षा कवच बनाएं।"
            else:
                return f"नमस्ते {name} जी! आपके खर्चे आमदनी से अधिक हैं। गैर-जरूरी खर्चों को कम करें और कर्ज मुक्ति पर ध्यान दें।"
        else:
            if health_status == "Healthy Surplus":
                return f"Hello {name}! You have a healthy monthly surplus of ₹{int(surplus):,} from your ₹{int(income):,} income. Allocate this to strengthen your emergency fund and goals."
            elif health_status == "Tight Budget":
                return f"Hello {name}! You have ₹{int(surplus):,} remaining after ₹{int(expenses):,} in expenses. Focus on building your emergency safety buffer step by step."
            else:
                return f"Hello {name}! Your expenses exceed your income. Prioritize debt reduction and essential expense auditing to restore positive cashflow."
