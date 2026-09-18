"""
Sakhi Debt Service & Snowball Refinancing Analysis Module.

Provides deterministic calculations for:
1. Exact monthly interest drain (rupees paid to moneylenders vs institutions).
2. Subsidized SHG refinancing arbitrage savings.
3. Snowball (smallest balance first) and Avalanche (highest APR first) payoff ranking.
"""

from typing import List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import select
from app.models.user import User
from app.models.debt import Debt
from app.schemas.debt import (
    DebtCreate,
    DebtUpdate,
    DebtResponse,
    DebtSnowballItem,
    DebtSnowballAnalysisResponse,
)
from app.core.logging import logger


class DebtService:
    """Service handling debt records and deterministic payoff calculations."""

    @staticmethod
    def format_debt_response(debt: Debt) -> DebtResponse:
        """Compute monthly interest drain and format DebtResponse."""
        interest_drain = round(debt.current_balance * (debt.monthly_interest_rate / 100.0), 2)
        return DebtResponse(
            id=debt.id,
            user_id=debt.user_id,
            lender_name=debt.lender_name,
            lender_type=debt.lender_type,
            principal_amount=round(debt.principal_amount, 2),
            current_balance=round(debt.current_balance, 2),
            monthly_interest_rate=debt.monthly_interest_rate,
            annual_interest_rate=debt.annual_interest_rate,
            monthly_emi_payment=round(debt.monthly_emi_payment, 2),
            is_cleared=debt.is_cleared,
            notes=debt.notes,
            monthly_interest_drain=interest_drain,
            created_at=debt.created_at,
            updated_at=debt.updated_at,
        )

    @staticmethod
    def create_debt(db: Session, user_id: int, debt_in: DebtCreate) -> DebtResponse:
        """Record and persist a new debt."""
        annual_rate = debt_in.annual_interest_rate
        if annual_rate is None:
            annual_rate = round(debt_in.monthly_interest_rate * 12.0, 2)

        debt = Debt(
            user_id=user_id,
            lender_name=debt_in.lender_name,
            lender_type=debt_in.lender_type,
            principal_amount=debt_in.principal_amount,
            current_balance=debt_in.current_balance,
            monthly_interest_rate=debt_in.monthly_interest_rate,
            annual_interest_rate=annual_rate,
            monthly_emi_payment=debt_in.monthly_emi_payment,
            is_cleared=debt_in.is_cleared or debt_in.current_balance <= 0,
            notes=debt_in.notes,
        )
        db.add(debt)
        db.commit()
        db.refresh(debt)
        logger.info(f"Recorded debt id={debt.id} '{debt.lender_name}' for user_id={user_id}: Balance ₹{debt.current_balance}")
        return DebtService.format_debt_response(debt)

    @staticmethod
    def get_user_debts(db: Session, user_id: int) -> List[DebtResponse]:
        """Fetch all active and cleared debts for a user."""
        stmt = select(Debt).where(Debt.user_id == user_id).order_by(Debt.is_cleared.asc(), Debt.current_balance.desc())
        debts = list(db.execute(stmt).scalars().all())
        return [DebtService.format_debt_response(d) for d in debts]

    @staticmethod
    def get_debt_by_id(db: Session, user_id: int, debt_id: int) -> Optional[Debt]:
        """Fetch a single debt record."""
        stmt = select(Debt).where(Debt.id == debt_id, Debt.user_id == user_id)
        return db.execute(stmt).scalar_one_or_none()

    @staticmethod
    def update_debt(db: Session, user_id: int, debt_id: int, debt_in: DebtUpdate) -> Optional[DebtResponse]:
        """Update fields of a debt record."""
        debt = DebtService.get_debt_by_id(db, user_id, debt_id)
        if not debt:
            return None

        update_data = debt_in.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(debt, field, value)

        if "monthly_interest_rate" in update_data and "annual_interest_rate" not in update_data:
            debt.annual_interest_rate = round(debt.monthly_interest_rate * 12.0, 2)

        if debt.current_balance <= 0:
            debt.is_cleared = True

        db.commit()
        db.refresh(debt)
        logger.info(f"Updated debt id={debt_id} for user_id={user_id}")
        return DebtService.format_debt_response(debt)

    @staticmethod
    def delete_debt(db: Session, user_id: int, debt_id: int) -> bool:
        """Delete a debt liability record."""
        debt = DebtService.get_debt_by_id(db, user_id, debt_id)
        if not debt:
            return False
        db.delete(debt)
        db.commit()
        logger.info(f"Deleted debt id={debt_id} for user_id={user_id}")
        return True

    @staticmethod
    def calculate_snowball_analysis(db: Session, user: User) -> DebtSnowballAnalysisResponse:
        """
        Compute deterministic interest drain, SHG refinancing arbitrage savings,
        and Snowball / Avalanche payoff sequences.
        """
        stmt = select(Debt).where(Debt.user_id == user.id, Debt.is_cleared == False)
        active_debts: List[Debt] = list(db.execute(stmt).scalars().all())

        if not active_debts:
            # If no logged debts exist, check baseline user initial_debt
            baseline_debt = float(user.initial_debt)
            return DebtSnowballAnalysisResponse(
                user_id=user.id,
                total_debt_balance=round(baseline_debt, 2),
                total_monthly_interest_drain=0.0,
                total_monthly_emi=0.0,
                informal_debt_balance=0.0,
                informal_monthly_interest=0.0,
                potential_shg_refinance_monthly_savings=0.0,
                potential_annual_refinance_savings=0.0,
                debts_snowball_order=[],
                debts_avalanche_order=[],
                actionable_recommendation="No active debts recorded. Continue focusing on building your emergency savings."
                if baseline_debt == 0
                else f"You have ₹{int(baseline_debt):,} in baseline debt. Log specific lender details to generate a debt snowball payoff plan.",
            )

        total_balance = sum(d.current_balance for d in active_debts)
        total_interest_drain = sum(d.current_balance * (d.monthly_interest_rate / 100.0) for d in active_debts)
        total_emi = sum(d.monthly_emi_payment for d in active_debts)

        # Filter informal moneylender loans (typically 24% to 60%+ APR)
        informal_debts = [d for d in active_debts if d.lender_type == "moneylender"]
        informal_balance = sum(d.current_balance for d in informal_debts)
        informal_interest = sum(d.current_balance * (d.monthly_interest_rate / 100.0) for d in informal_debts)

        # Standard SHG / Stree Nidhi interest benchmark is 1.0% per month (12% APR)
        shg_monthly_rate = 1.0 / 100.0
        shg_hypothetical_interest = informal_balance * shg_monthly_rate
        potential_monthly_savings = max(0.0, informal_interest - shg_hypothetical_interest)
        potential_annual_savings = potential_monthly_savings * 12.0

        # Snowball Order: Smallest current balance to largest
        snowball_sorted = sorted(active_debts, key=lambda d: (d.current_balance, -d.monthly_interest_rate))
        snowball_items = [
            DebtSnowballItem(
                debt_id=d.id,
                lender_name=d.lender_name,
                lender_type=d.lender_type,
                current_balance=round(d.current_balance, 2),
                monthly_interest_rate=d.monthly_interest_rate,
                annual_interest_rate=d.annual_interest_rate,
                monthly_interest_drain=round(d.current_balance * (d.monthly_interest_rate / 100.0), 2),
                payoff_priority_rank=idx + 1,
            )
            for idx, d in enumerate(snowball_sorted)
        ]

        # Avalanche Order: Highest interest rate to lowest
        avalanche_sorted = sorted(active_debts, key=lambda d: (-d.monthly_interest_rate, d.current_balance))
        avalanche_items = [
            DebtSnowballItem(
                debt_id=d.id,
                lender_name=d.lender_name,
                lender_type=d.lender_type,
                current_balance=round(d.current_balance, 2),
                monthly_interest_rate=d.monthly_interest_rate,
                annual_interest_rate=d.annual_interest_rate,
                monthly_interest_drain=round(d.current_balance * (d.monthly_interest_rate / 100.0), 2),
                payoff_priority_rank=idx + 1,
            )
            for idx, d in enumerate(avalanche_sorted)
        ]

        # Generate Actionable Plain-Language Recommendation
        rec = DebtService._build_debt_recommendation(
            language=user.primary_language,
            total_balance=total_balance,
            interest_drain=total_interest_drain,
            informal_balance=informal_balance,
            monthly_savings=potential_monthly_savings,
            smallest_lender=snowball_items[0].lender_name if snowball_items else "",
            smallest_amount=snowball_items[0].current_balance if snowball_items else 0.0,
        )

        return DebtSnowballAnalysisResponse(
            user_id=user.id,
            total_debt_balance=round(total_balance, 2),
            total_monthly_interest_drain=round(total_interest_drain, 2),
            total_monthly_emi=round(total_emi, 2),
            informal_debt_balance=round(informal_balance, 2),
            informal_monthly_interest=round(informal_interest, 2),
            potential_shg_refinance_monthly_savings=round(potential_monthly_savings, 2),
            potential_annual_refinance_savings=round(potential_annual_savings, 2),
            debts_snowball_order=snowball_items,
            debts_avalanche_order=avalanche_items,
            actionable_recommendation=rec,
        )

    @staticmethod
    def _build_debt_recommendation(
        language: str,
        total_balance: float,
        interest_drain: float,
        informal_balance: float,
        monthly_savings: float,
        smallest_lender: str,
        smallest_amount: float,
    ) -> str:
        """Construct plain-language debt payoff advice."""
        if language == "te":
            msg = f"మీరు నెలకు ₹{int(interest_drain):,} వడ్డీగా చెల్లిస్తున్నారు. "
            if informal_balance > 0 and monthly_savings > 0:
                msg += f"వడ్డీ వ్యాపారి అప్పును SHG లేదా స్త్రీ నిధి రుణం (12% వడ్డీ) తో మార్చడం ద్వారా మీరు నెలకు ₹{int(monthly_savings):,} ఆదా చేయవచ్చు. "
            if smallest_lender:
                msg += f"మొదట చిన్న అప్పు అయిన '{smallest_lender}' (₹{int(smallest_amount):,}) ను పూర్తిగా చెల్లించి అప్పుల భారాన్ని తగ్గించుకోండి."
            return msg
        elif language == "hi":
            msg = f"आप हर महीने ₹{int(interest_drain):,} सिर्फ ब्याज में दे रहे हैं। "
            if informal_balance > 0 and monthly_savings > 0:
                msg += f"साहूकार के कर्ज को SHG ऋण (12% वार्षिक) में बदलकर आप हर महीने ₹{int(monthly_savings):,} बचा सकते हैं। "
            if smallest_lender:
                msg += f"सबसे पहले छोटे कर्ज '{smallest_lender}' (₹{int(smallest_amount):,}) को खत्म करके ऋण मुक्ति शुरू करें।"
            return msg
        else:
            msg = f"You are paying ₹{int(interest_drain):,}/month in interest drain. "
            if informal_balance > 0 and monthly_savings > 0:
                msg += f"Refinancing your private moneylender debt with an SHG/Stree Nidhi loan can save you ₹{int(monthly_savings):,}/month. "
            if smallest_lender:
                msg += f"Use the Debt Snowball: clear '{smallest_lender}' (₹{int(smallest_amount):,}) first for quick momentum."
            return msg
