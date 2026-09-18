"""
Sakhi Deterministic Financial Calculators Service Module.

Implements pure mathematical formulas for:
1. Emergency Fund Benchmarks and Multi-Horizon Payoff Options.
2. Debt Refinancing Arbitrage (Moneylender 36-60% vs SHG 12% APR).
3. Post Office / Bank Recurring Deposit (RD) Quarterly Compounding Math.
4. Goal Horizon Feasibility & Surplus Allocation.
"""

import math
from typing import List
from app.schemas.calculator import (
    EmergencyFundCalcRequest,
    EmergencyFundCalcResponse,
    EmergencyFundHorizonOption,
    DebtRefinanceCalcRequest,
    DebtRefinanceCalcResponse,
    RDCalcRequest,
    RDCalcResponse,
    GoalHorizonCalcRequest,
    GoalHorizonCalcResponse,
)


class FinancialCalculators:
    """Pure deterministic mathematical calculator functions."""

    @staticmethod
    def calculate_emergency_fund(req: EmergencyFundCalcRequest) -> EmergencyFundCalcResponse:
        """
        Calculate 3-month emergency safety buffer (Suraksha Kavach)
        and compute monthly required savings across 3, 6, and 12 month timelines.
        """
        emergency_target = round(req.monthly_expenses * req.months_buffer, 2)
        shortfall = max(0.0, round(emergency_target - req.current_savings, 2))
        progress = min(100.0, round((req.current_savings / emergency_target) * 100.0, 1)) if emergency_target > 0 else 100.0

        # Safety rating
        if progress >= 100.0:
            rating = "Safe & Resilient"
            guidance = "Your family is fully protected with 3 months of living expenses! This shield protects you from private moneylenders during crises."
        elif progress >= 40.0:
            rating = "Partially Protected"
            guidance = f"You have achieved {progress}% of your emergency shield. Save regularly to close the remaining ₹{int(shortfall):,} gap."
        else:
            rating = "Vulnerable to Debt Traps"
            guidance = f"Without an emergency buffer, unexpected crises force high-interest borrowing. Prioritize building ₹{int(shortfall):,} in safety savings."

        # Horizons: 3, 6, 12 months
        plan_options = []
        if shortfall > 0:
            for m in [3, 6, 12]:
                plan_options.append(EmergencyFundHorizonOption(months=m, monthly_savings_needed=round(shortfall / m, 2)))
        else:
            plan_options.append(EmergencyFundHorizonOption(months=0, monthly_savings_needed=0.0))

        return EmergencyFundCalcResponse(
            monthly_expenses=round(req.monthly_expenses, 2),
            months_buffer=req.months_buffer,
            emergency_target=emergency_target,
            current_savings=round(req.current_savings, 2),
            shortfall=shortfall,
            progress_percentage=progress,
            safety_rating=rating,
            plan_options=plan_options,
            guidance=guidance,
        )

    @staticmethod
    def calculate_debt_refinance(req: DebtRefinanceCalcRequest) -> DebtRefinanceCalcResponse:
        """
        Calculate exact financial arbitrage between informal moneylender debt
        and subsidized SHG / Stree Nidhi credit.
        """
        moneylender_apr = round(req.moneylender_monthly_rate * 12.0, 2)
        moneylender_monthly_interest = round(req.loan_amount * (req.moneylender_monthly_rate / 100.0), 2)
        moneylender_total_interest = round(moneylender_monthly_interest * req.tenure_months, 2)

        shg_monthly_rate = round(req.shg_annual_rate / 12.0, 2)
        shg_monthly_interest = round(req.loan_amount * (shg_monthly_rate / 100.0), 2)
        shg_total_interest = round(shg_monthly_interest * req.tenure_months, 2)

        monthly_saved = max(0.0, round(moneylender_monthly_interest - shg_monthly_interest, 2))
        total_saved = max(0.0, round(moneylender_total_interest - shg_total_interest, 2))
        
        reduction_pct = 0.0
        if moneylender_monthly_interest > 0:
            reduction_pct = round(((moneylender_monthly_interest - shg_monthly_interest) / moneylender_monthly_interest) * 100.0, 1)

        guidance = (
            f"By refinancing your ₹{int(req.loan_amount):,} moneylender loan ({moneylender_apr}% APR) "
            f"through an SHG loan ({req.shg_annual_rate}% APR), you immediately save ₹{int(monthly_saved):,} every single month "
            f"(₹{int(total_saved):,} over {req.tenure_months} months)."
        )

        return DebtRefinanceCalcResponse(
            loan_amount=round(req.loan_amount, 2),
            tenure_months=req.tenure_months,
            moneylender_monthly_rate=req.moneylender_monthly_rate,
            moneylender_apr=moneylender_apr,
            moneylender_monthly_interest=moneylender_monthly_interest,
            moneylender_total_interest_paid=moneylender_total_interest,
            shg_apr=req.shg_annual_rate,
            shg_monthly_rate=shg_monthly_rate,
            shg_monthly_interest=shg_monthly_interest,
            shg_total_interest_paid=shg_total_interest,
            monthly_rupees_saved=monthly_saved,
            total_tenure_rupees_saved=total_saved,
            interest_reduction_percentage=reduction_pct,
            guidance=guidance,
        )

    @staticmethod
    def calculate_recurring_deposit(req: RDCalcRequest) -> RDCalcResponse:
        """
        Calculate maturity and interest earned for Indian Recurring Deposits (Post Office / Bank RD).
        Formula: Quarterly compounding on monthly deposits:
        M = sum_{i=1}^{n} P * (1 + r / 400)^(4 * (n - i + 1) / 12)
        """
        p = req.monthly_deposit
        r = req.annual_interest_rate
        n = req.tenure_months

        total_deposited = round(p * n, 2)

        # Standard Indian Banking / Post Office quarterly compounding sum
        maturity_amount = 0.0
        for i in range(1, n + 1):
            months_invested = n - i + 1
            # 4 * months_invested / 12 = quarters invested
            quarters = (4.0 * months_invested) / 12.0
            compounded = p * math.pow(1.0 + (r / 400.0), quarters)
            maturity_amount += compounded

        maturity_amount = round(maturity_amount, 2)
        interest_earned = max(0.0, round(maturity_amount - total_deposited, 2))

        guidance = (
            f"Depositing ₹{int(p):,}/month in a Post Office/Bank RD at {r}% annual interest "
            f"will grow your ₹{int(total_deposited):,} total deposit into ₹{int(maturity_amount):,} "
            f"(earning ₹{int(interest_earned):,} in risk-free guaranteed interest)."
        )

        return RDCalcResponse(
            monthly_deposit=round(p, 2),
            annual_interest_rate=r,
            tenure_months=n,
            total_deposited=total_deposited,
            maturity_amount=maturity_amount,
            interest_earned=interest_earned,
            compounding_frequency="Quarterly Compounded (Standard Post Office / RBI Rules)",
            guidance=guidance,
        )

    @staticmethod
    def calculate_goal_horizon(req: GoalHorizonCalcRequest) -> GoalHorizonCalcResponse:
        """
        Calculate how many months are needed to reach a goal given available monthly surplus.
        """
        remaining = max(0.0, req.target_amount - req.current_savings)
        if remaining == 0.0:
            return GoalHorizonCalcResponse(
                target_amount=round(req.target_amount, 2),
                current_savings=round(req.current_savings, 2),
                remaining_amount=0.0,
                available_monthly_surplus=round(req.available_monthly_surplus, 2),
                months_needed=0,
                recommended_monthly_allocation=0.0,
                surplus_utilization_percentage=0.0,
                is_feasible_in_target_timeline=True,
                feasibility_status="Easily Achievable",
                guidance="Goal is already fully achieved!",
            )

        # If user allocates 50% of available surplus to this goal:
        default_allocation = round(req.available_monthly_surplus * 0.5, 2)
        months_needed = math.ceil(remaining / default_allocation) if default_allocation > 0 else 999

        is_feasible_target = None
        if req.target_months:
            req_monthly = round(remaining / req.target_months, 2)
            if req_monthly <= req.available_monthly_surplus * 0.7:
                feasibility_status = "Easily Achievable"
                recommended_allocation = req_monthly
                is_feasible_target = True
                guidance = f"You can achieve this in {req.target_months} months by saving ₹{int(req_monthly):,}/month from your ₹{int(req.available_monthly_surplus):,} surplus."
            elif req_monthly <= req.available_monthly_surplus:
                feasibility_status = "Feasible"
                recommended_allocation = req_monthly
                is_feasible_target = True
                guidance = f"Achieving this in {req.target_months} months requires ₹{int(req_monthly):,}/month, consuming most of your monthly surplus."
            else:
                feasibility_status = "Stretched - Horizon Adjusted"
                recommended_allocation = default_allocation
                is_feasible_target = False
                adjusted_months = math.ceil(remaining / default_allocation)
                guidance = f"Target requires ₹{int(req_monthly):,}/mo which exceeds your ₹{int(req.available_monthly_surplus):,} surplus. Recommended timeline: {adjusted_months} months at ₹{int(default_allocation):,}/month."
        else:
            recommended_allocation = default_allocation
            feasibility_status = "Feasible"
            guidance = f"By dedicating ₹{int(default_allocation):,}/month (50% of your surplus), you will reach your goal in {months_needed} months."

        surplus_utilization = round((recommended_allocation / req.available_monthly_surplus) * 100.0, 1) if req.available_monthly_surplus > 0 else 0.0

        return GoalHorizonCalcResponse(
            target_amount=round(req.target_amount, 2),
            current_savings=round(req.current_savings, 2),
            remaining_amount=round(remaining, 2),
            available_monthly_surplus=round(req.available_monthly_surplus, 2),
            months_needed=months_needed,
            recommended_monthly_allocation=recommended_allocation,
            surplus_utilization_percentage=surplus_utilization,
            is_feasible_in_target_timeline=is_feasible_target,
            feasibility_status=feasibility_status,
            guidance=guidance,
        )
