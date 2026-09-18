"""
Sakhi Deterministic Financial Calculators API Endpoints.

Provides zero-hallucination, pure mathematical financial tools for:
- Emergency Fund target & multi-horizon plan
- Moneylender vs SHG debt refinancing arbitrage savings
- Recurring Deposit (RD) compounding maturity & interest
- Goal horizon feasibility based on monthly surplus
"""

from fastapi import APIRouter, status
from app.schemas.calculator import (
    EmergencyFundCalcRequest,
    EmergencyFundCalcResponse,
    DebtRefinanceCalcRequest,
    DebtRefinanceCalcResponse,
    RDCalcRequest,
    RDCalcResponse,
    GoalHorizonCalcRequest,
    GoalHorizonCalcResponse,
)
from app.services.calculators import FinancialCalculators

router = APIRouter(prefix="/calculators", tags=["Deterministic Calculators"])


@router.post(
    "/emergency-fund",
    response_model=EmergencyFundCalcResponse,
    summary="Calculate Emergency Buffer Target",
    description="Calculate 3-month living expense buffer (Suraksha Kavach) and savings plans across 3, 6, and 12 month horizons."
)
def calculate_emergency_fund(req: EmergencyFundCalcRequest) -> EmergencyFundCalcResponse:
    """Calculate emergency fund target and multi-horizon options."""
    return FinancialCalculators.calculate_emergency_fund(req)


@router.post(
    "/debt-refinance",
    response_model=DebtRefinanceCalcResponse,
    summary="Calculate Debt Refinancing Arbitrage (Moneylender vs SHG)",
    description="Calculates exact monthly and tenure rupees saved by refinancing high-interest moneylender debt with subsidized SHG / Stree Nidhi loans."
)
def calculate_debt_refinance(req: DebtRefinanceCalcRequest) -> DebtRefinanceCalcResponse:
    """Calculate moneylender vs SHG refinancing arbitrage savings."""
    return FinancialCalculators.calculate_debt_refinance(req)


@router.post(
    "/recurring-deposit",
    response_model=RDCalcResponse,
    summary="Calculate Recurring Deposit (RD) Compounding",
    description="Calculates maturity amount and interest earned for Indian Post Office & Bank Recurring Deposits using official quarterly compounding."
)
def calculate_recurring_deposit(req: RDCalcRequest) -> RDCalcResponse:
    """Calculate RD maturity amount and guaranteed interest."""
    return FinancialCalculators.calculate_recurring_deposit(req)


@router.post(
    "/goal-horizon",
    response_model=GoalHorizonCalcResponse,
    summary="Calculate Goal Horizon & Surplus Allocation",
    description="Determines how many months are needed to reach a savings goal given available monthly surplus."
)
def calculate_goal_horizon(req: GoalHorizonCalcRequest) -> GoalHorizonCalcResponse:
    """Calculate goal horizon and surplus allocation feasibility."""
    return FinancialCalculators.calculate_goal_horizon(req)
