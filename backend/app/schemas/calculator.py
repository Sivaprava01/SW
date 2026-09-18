"""
Sakhi Deterministic Financial Calculator Schemas.

Pydantic v2 request and response contracts for mathematical financial calculators:
1. Emergency Fund Calculator
2. Debt Refinancing (Moneylender vs SHG) Arbitrage Calculator
3. Recurring Deposit (RD) Compounding Calculator
4. Goal Horizon & Surplus Allocation Calculator
"""

from typing import Dict, List, Literal, Optional
from pydantic import BaseModel, Field


# -----------------------------------------------------------------------------
# 1. Emergency Fund Calculator
# -----------------------------------------------------------------------------
class EmergencyFundCalcRequest(BaseModel):
    """Input for calculating emergency buffer requirement."""
    monthly_expenses: float = Field(..., gt=0.0, description="Monthly essential living expenses in INR")
    months_buffer: int = Field(default=3, ge=1, le=12, description="Target buffer duration in months (default: 3)")
    current_savings: float = Field(default=0.0, ge=0.0, description="Current existing liquid savings in INR")


class EmergencyFundHorizonOption(BaseModel):
    """Monthly required savings for different time horizons."""
    months: int
    monthly_savings_needed: float


class EmergencyFundCalcResponse(BaseModel):
    """Output for emergency buffer calculations."""
    monthly_expenses: float
    months_buffer: int
    emergency_target: float
    current_savings: float
    shortfall: float
    progress_percentage: float
    safety_rating: Literal["Safe & Resilient", "Partially Protected", "Vulnerable to Debt Traps"]
    plan_options: List[EmergencyFundHorizonOption]
    guidance: str


# -----------------------------------------------------------------------------
# 2. Debt Refinancing Arbitrage Calculator (Moneylender vs SHG)
# -----------------------------------------------------------------------------
class DebtRefinanceCalcRequest(BaseModel):
    """Input for debt refinancing arbitrage."""
    loan_amount: float = Field(..., gt=0.0, description="Outstanding loan amount in INR")
    moneylender_monthly_rate: float = Field(
        default=3.0, gt=0.0, le=20.0, description="Moneylender interest rate % per month (e.g. 3.0 for ₹3/₹100/mo = 36% APR)"
    )
    shg_annual_rate: float = Field(
        default=12.0, ge=4.0, le=24.0, description="Subsidized SHG / Stree Nidhi annual percentage rate (APR %, default 12.0)"
    )
    tenure_months: int = Field(default=12, ge=1, le=60, description="Loan tenure in months")


class DebtRefinanceCalcResponse(BaseModel):
    """Output for debt refinancing arbitrage."""
    loan_amount: float
    tenure_months: int
    moneylender_monthly_rate: float
    moneylender_apr: float
    moneylender_monthly_interest: float
    moneylender_total_interest_paid: float
    
    shg_apr: float
    shg_monthly_rate: float
    shg_monthly_interest: float
    shg_total_interest_paid: float
    
    monthly_rupees_saved: float
    total_tenure_rupees_saved: float
    interest_reduction_percentage: float
    guidance: str


# -----------------------------------------------------------------------------
# 3. Recurring Deposit (RD) Compounding Calculator
# -----------------------------------------------------------------------------
class RDCalcRequest(BaseModel):
    """Input for recurring deposit compounding calculation."""
    monthly_deposit: float = Field(..., gt=0.0, description="Monthly recurring deposit amount in INR")
    annual_interest_rate: float = Field(
        default=6.7, gt=0.0, le=20.0, description="Annual interest rate % (Post Office RD default 6.7%)"
    )
    tenure_months: int = Field(default=12, ge=3, le=120, description="Tenure in months (multiples of 3 or 12)")


class RDCalcResponse(BaseModel):
    """Output for recurring deposit compounding calculation."""
    monthly_deposit: float
    annual_interest_rate: float
    tenure_months: int
    total_deposited: float
    maturity_amount: float
    interest_earned: float
    compounding_frequency: str
    guidance: str


# -----------------------------------------------------------------------------
# 4. Goal Horizon & Surplus Allocation Calculator
# -----------------------------------------------------------------------------
class GoalHorizonCalcRequest(BaseModel):
    """Input for calculating goal feasibility based on monthly surplus."""
    target_amount: float = Field(..., gt=0.0, description="Target goal amount in INR")
    current_savings: float = Field(default=0.0, ge=0.0, description="Currently saved amount towards goal")
    available_monthly_surplus: float = Field(..., gt=0.0, description="Available monthly disposable surplus in INR")
    target_months: Optional[int] = Field(default=None, ge=1, le=120, description="Desired timeline in months (optional)")


class GoalHorizonCalcResponse(BaseModel):
    """Output for goal horizon and allocation calculation."""
    target_amount: float
    current_savings: float
    remaining_amount: float
    available_monthly_surplus: float
    months_needed: int
    recommended_monthly_allocation: float
    surplus_utilization_percentage: float
    is_feasible_in_target_timeline: Optional[bool]
    feasibility_status: Literal["Easily Achievable", "Feasible", "Stretched - Horizon Adjusted", "Insufficient Surplus"]
    guidance: str
