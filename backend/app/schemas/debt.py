"""
Sakhi Debt & Snowball Analysis Schemas.

Pydantic v2 schemas for recording liabilities and computing debt-snowball payoff strategies.
"""

import datetime as dt
from typing import List, Optional, Literal
from pydantic import BaseModel, Field, ConfigDict


class DebtBase(BaseModel):
    """Base debt attributes."""
    lender_name: str = Field(..., min_length=1, max_length=150, description="Name of lender or institution")
    lender_type: Literal["moneylender", "shg", "bank", "family_friend"] = Field(
        default="moneylender", description="Lender classification"
    )
    principal_amount: float = Field(..., gt=0.0, description="Original loan principal in INR")
    current_balance: float = Field(..., ge=0.0, description="Outstanding balance in INR")
    monthly_interest_rate: float = Field(
        default=3.0, ge=0.0, le=100.0, description="Monthly interest rate % (e.g. 3.0 for 3% per month)"
    )
    annual_interest_rate: Optional[float] = Field(
        default=None, ge=0.0, description="Annual percentage rate (APR %); auto-calculated from monthly if omitted"
    )
    monthly_emi_payment: float = Field(default=0.0, ge=0.0, description="Monthly installment / interest payment in INR")
    is_cleared: bool = Field(default=False, description="Whether loan is fully repaid")
    notes: Optional[str] = Field(default=None, max_length=255, description="Optional notes or terms")


class DebtCreate(DebtBase):
    """Schema for recording a new debt."""
    pass


class DebtUpdate(BaseModel):
    """Schema for updating an existing debt record."""
    lender_name: Optional[str] = Field(default=None, min_length=1, max_length=150)
    lender_type: Optional[Literal["moneylender", "shg", "bank", "family_friend"]] = None
    principal_amount: Optional[float] = Field(default=None, gt=0.0)
    current_balance: Optional[float] = Field(default=None, ge=0.0)
    monthly_interest_rate: Optional[float] = Field(default=None, ge=0.0, le=100.0)
    annual_interest_rate: Optional[float] = Field(default=None, ge=0.0)
    monthly_emi_payment: Optional[float] = Field(default=None, ge=0.0)
    is_cleared: Optional[bool] = None
    notes: Optional[str] = Field(default=None, max_length=255)


class DebtResponse(DebtBase):
    """Output schema for a debt liability record."""
    id: int
    user_id: int
    monthly_interest_drain: float = Field(..., description="Estimated rupees lost to interest each month")
    created_at: dt.datetime
    updated_at: dt.datetime

    model_config = ConfigDict(from_attributes=True)


class DebtSnowballItem(BaseModel):
    """Single item in the recommended payoff sequence."""
    debt_id: int
    lender_name: str
    lender_type: str
    current_balance: float
    monthly_interest_rate: float
    annual_interest_rate: float
    monthly_interest_drain: float
    payoff_priority_rank: int


class DebtSnowballAnalysisResponse(BaseModel):
    """Deterministic debt snowball, interest drain, and SHG refinancing report."""
    user_id: int
    total_debt_balance: float = Field(..., description="Sum of all outstanding debt balances")
    total_monthly_interest_drain: float = Field(..., description="Total rupees paid in interest per month across all debts")
    total_monthly_emi: float = Field(..., description="Total monthly installment payments")
    
    # Informal Moneylender Breakdown
    informal_debt_balance: float = Field(..., description="Total debt held with high-interest informal moneylenders")
    informal_monthly_interest: float = Field(..., description="Monthly interest drain on informal debt alone")
    
    # Subsidized SHG Refinancing Opportunity Math
    potential_shg_refinance_monthly_savings: float = Field(
        ..., description="Monthly rupees saved if informal moneylender debt is refinanced via SHG / Stree Nidhi at 12% APR"
    )
    potential_annual_refinance_savings: float = Field(
        ..., description="Annual rupees saved through SHG debt conversion"
    )
    
    # Deterministic Payoff Rankings
    debts_snowball_order: List[DebtSnowballItem] = Field(..., description="Debts ordered from smallest balance to largest")
    debts_avalanche_order: List[DebtSnowballItem] = Field(..., description="Debts ordered from highest interest rate to lowest")
    
    actionable_recommendation: str = Field(..., description="Deterministic, plain-language guidance summary")
