import sys
import os

# Ensure UTF-8 output on Windows console
if sys.platform == "win32":
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

# Add backend to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.services.financial_engine import (
    calculate_monthly_surplus,
    calculate_goal_metrics,
    calculate_emergency_fund_metrics,
    calculate_user_totals,
    determine_journey_stage,
    JOURNEY_STAGES
)
from app.services.scheme_matcher import match_schemes
from app.schemas.scheme import SchemeMatchRequest
from app.data.schemes_seed import GOVERNMENT_SCHEMES
from app.models.scheme import GovernmentScheme
from app.models.user import User
from app.models.transaction import Transaction
from app.models.goal import Goal
from app.database import Base, SessionLocal, engine
from app.services.ai_service import generate_fallback_reply
from app.schemas.ai import FinancialContextPayload

def test_financial_calculations():
    print("--- 1. Testing Financial Engine Deterministic Math ---")
    
    # Test 1: Surplus
    income = 12000.0
    expenses = 7000.0
    surplus = calculate_monthly_surplus(income, expenses)
    print(f"Income: ₹{income}, Expenses: ₹{expenses} -> Surplus: ₹{surplus}")
    assert surplus == 5000.0, f"Expected surplus 5000.0, got {surplus}"

    # Test 2: Goal Metrics Normal
    target = 50000.0
    current = 10000.0
    duration_months = "12"
    goal_res = calculate_goal_metrics(target, current, duration_months)
    print(f"Goal Metrics: {goal_res}")
    assert goal_res["remaining_amount"] == 40000.0
    assert goal_res["monthly_saving_required"] in [3333.33, 3334.0, 3333.0] or round(goal_res["monthly_saving_required"]) == 3333
    assert goal_res["percent_complete"] == 20.0

    # Test 3: Goal Metrics Edge Cases (Target = 0, Target < Current, Negative)
    edge_goal_1 = calculate_goal_metrics(0.0, 500.0, "12")
    assert edge_goal_1["percent_complete"] == 100.0
    assert edge_goal_1["remaining_amount"] == 0.0
    assert edge_goal_1["monthly_saving_required"] == 0.0

    edge_goal_2 = calculate_goal_metrics(10000.0, 15000.0, "6")
    assert edge_goal_2["percent_complete"] == 100.0
    assert edge_goal_2["remaining_amount"] == 0.0

    # Test 4: Emergency Fund Normal & Zero expenses
    ef = calculate_emergency_fund_metrics(expenses, current)
    print(f"Emergency Fund: {ef}")
    assert ef["target"] == 21000.0  # 3 x 7000
    assert ef["remaining"] == 11000.0
    assert ef["percent_complete"] == round((10000 / 21000) * 100, 1)

    ef_zero = calculate_emergency_fund_metrics(0.0, 0.0)
    assert ef_zero["target"] == 15000.0  # Safe minimum fallback
    assert ef_zero["percent_complete"] == 0.0

    print("Financial Engine calculations verified!\n")

def test_user_totals_and_transactions():
    print("--- 2. Testing User Totals & Transaction Aggregation ---")
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        # Create a test user
        test_user = User(
            name="Test User",
            age=30,
            state="Telangana",
            monthly_income=10000.0,
            monthly_expenses=6000.0,
            savings=5000.0,
            debt=15000.0
        )
        db.add(test_user)
        db.commit()
        db.refresh(test_user)

        # 1. Totals before transactions
        totals_init = calculate_user_totals(db, test_user)
        assert totals_init["total_income"] == 10000.0
        assert totals_init["total_expense"] == 6000.0
        assert totals_init["surplus"] == 4000.0

        # 2. Add an income transaction (+2000) and expense transaction (+1000)
        tx1 = Transaction(user_id=test_user.id, amount=2000.0, type="income", category="Sales", date="2026-09-18")
        tx2 = Transaction(user_id=test_user.id, amount=1000.0, type="expense", category="Food", date="2026-09-18")
        db.add_all([tx1, tx2])
        db.commit()

        # 3. Totals after transactions
        totals_after = calculate_user_totals(db, test_user)
        assert totals_after["total_income"] == 12000.0
        assert totals_after["total_expense"] == 7000.0
        assert totals_after["surplus"] == 5000.0

        # Verify base user profile remained untouched
        db.refresh(test_user)
        assert test_user.monthly_income == 10000.0
        assert test_user.monthly_expenses == 6000.0

        print(f"Aggregated Totals: Income ₹{totals_after['total_income']}, Expense ₹{totals_after['total_expense']}, Surplus ₹{totals_after['surplus']}")
        print("User Totals & Transaction Aggregation verified!\n")
    finally:
        db.close()

def test_journey_stage_transitions():
    print("--- 3. Testing Financial Journey Stage Transitions ---")
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        # Case A: Stage 1 - Incomplete tracking (0 income or 0 expense)
        u_stage1 = User(name="S1", age=25, state="Telangana", monthly_income=0.0, monthly_expenses=0.0, savings=0.0, debt=0.0)
        db.add(u_stage1)
        db.commit()
        res1 = determine_journey_stage(db, u_stage1)
        assert res1["current_stage_id"] == 1, f"Expected Stage 1, got {res1['current_stage_id']}"

        # Case B: Stage 2 - Income & Expenses tracked, but Emergency Fund < 3x expenses
        u_stage2 = User(name="S2", age=25, state="Telangana", monthly_income=12000.0, monthly_expenses=7000.0, savings=5000.0, debt=0.0)
        db.add(u_stage2)
        db.commit()
        res2 = determine_journey_stage(db, u_stage2)
        assert res2["current_stage_id"] == 2, f"Expected Stage 2, got {res2['current_stage_id']}"

        # Case C: Stage 3 - Emergency Fund funded (savings >= 21k), but Debt > 0
        u_stage3 = User(name="S3", age=25, state="Telangana", monthly_income=12000.0, monthly_expenses=7000.0, savings=25000.0, debt=20000.0)
        db.add(u_stage3)
        db.commit()
        res3 = determine_journey_stage(db, u_stage3)
        assert res3["current_stage_id"] == 3, f"Expected Stage 3, got {res3['current_stage_id']}"

        print("Journey Stage Transitions verified!\n")
    finally:
        db.close()

def test_database_and_schemes():
    print("--- 4. Testing Database and Scheme Matcher ---")
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        if db.query(GovernmentScheme).count() == 0:
            for s in GOVERNMENT_SCHEMES:
                db.add(GovernmentScheme(**s))
            db.commit()

        total_schemes = db.query(GovernmentScheme).count()
        print(f"Total schemes in DB: {total_schemes}")
        assert total_schemes >= 10, f"Expected at least 10 schemes, got {total_schemes}"

        # Test Matcher for Lakshmi:
        # Woman, 28, Telangana, has business interest, is SHG member
        req = SchemeMatchRequest(
            is_woman=True,
            age=28,
            state="Telangana",
            income_level="low",
            has_business_interest=True,
            is_shg_member=True,
            is_rural=True
        )
        matches = match_schemes(db, req)
        print(f"Matched {len(matches)} schemes for Lakshmi:")
        for m in matches[:5]:
            print(f"  - [{m.match_score}%] {m.scheme.name} ({m.scheme.category})")
            print(f"    Reasons: {', '.join(m.reasons)}")

        assert len(matches) > 0, "Expected scheme matches for Lakshmi"
        matched_names = [m.scheme.name for m in matches]
        assert any("Stree Nidhi" in name for name in matched_names), "Expected Stree Nidhi match for Telangana SHG"
        assert any("MUDRA" in name or "Lakhpati" in name for name in matched_names)
        print("Scheme Matcher verified!\n")
    finally:
        db.close()

def test_ai_fallback_explanation():
    print("--- 5. Testing AI Fallback Grounded Explanation ---")
    ctx = FinancialContextPayload(
        name="Lakshmi",
        income=12000,
        expenses=7000,
        surplus=5000,
        savings=10000,
        debt=20000,
        current_journey_stage="Build Emergency Fund",
        emergency_fund={"target": 21000, "current": 10000, "remaining": 11000},
        primary_goal={"name": "Daughter's Education", "target_amount": 50000, "monthly_saving_required": 3334}
    )

    q1 = "I have ₹20,000 debt. What should I do?"
    reply1 = generate_fallback_reply(q1, ctx)
    print(f"Q: {q1}\nA: {reply1}\n")
    assert "₹20,000" in reply1
    assert "₹5,000" in reply1

    q2 = "How much should I save for Daughter's Education?"
    reply2 = generate_fallback_reply(q2, ctx)
    print(f"Q: {q2}\nA: {reply2}\n")
    assert "₹3,334" in reply2 or "3,334" in reply2

    print("AI grounded explanations verified!\n")

if __name__ == "__main__":
    test_financial_calculations()
    test_user_totals_and_transactions()
    test_journey_stage_transitions()
    test_database_and_schemes()
    test_ai_fallback_explanation()
    print("========================================")
    print("ALL BACKEND & FINANCIAL TESTS PASSED 100%")
    print("========================================")
