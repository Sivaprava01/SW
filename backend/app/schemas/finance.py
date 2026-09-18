"""
Sakhi Financial Health Schemas.

Pydantic v2 schemas representing deterministic financial health calculations,
surplus analysis, savings ratios, and emergency fund metrics.
"""

from typing import Dict, List, Literal
from pydantic import BaseModel, Field


class CategoryBreakdown(BaseModel):
    """Aggregate total by category."""
    category: str
    total_amount: float
    percentage: float


class FinancialSummaryResponse(BaseModel):
    """Comprehensive deterministic financial health overview."""
    user_id: int
    user_name: str
    primary_language: str
    
    # Income, Expenses & Disposable Surplus
    monthly_income: float = Field(..., description="Monthly income in INR")
    monthly_expenses: float = Field(..., description="Monthly essential expenses in INR")
    monthly_surplus: float = Field(..., description="Calculated disposable surplus (Income - Expenses, min 0)")
    
    # Financial Ratios & Key Indicators
    savings_ratio: float = Field(..., description="Percentage of income remaining as surplus")
    expense_ratio: float = Field(..., description="Percentage of income consumed by expenses")
    
    # Balances
    total_savings: float = Field(..., description="Current liquid / total savings balance")
    total_debt: float = Field(..., description="Total outstanding debt balance")
    
    # Emergency Fund Baseline Metric (Suraksha Kavach)
    emergency_target: float = Field(..., description="3 months of essential living expenses")
    emergency_progress_percentage: float = Field(..., description="Percentage of emergency buffer achieved (capped at 100)")
    
    # Categorization & Plain-Language Summary
    health_status: Literal["Healthy Surplus", "Tight Budget", "Negative Cashflow / Deficit"] = Field(
        ..., description="Standard financial health classification"
    )
    health_summary: str = Field(..., description="Simple, jargon-free summary for the user")
    
    # Breakdown
    expense_breakdown: List[CategoryBreakdown] = Field(default_factory=list)
    income_breakdown: List[CategoryBreakdown] = Field(default_factory=list)
