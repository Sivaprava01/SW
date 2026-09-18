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
    JOURNEY_STAGES
)
from app.services.scheme_matcher import match_schemes
from app.schemas.scheme import SchemeMatchRequest
from app.data.schemes_seed import GOVERNMENT_SCHEMES
from app.models.scheme import GovernmentScheme
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

    # Test 2: Goal Metrics
    target = 50000.0
    current = 10000.0
    duration_months = "12"
    goal_res = calculate_goal_metrics(target, current, duration_months)
    print(f"Goal Metrics: {goal_res}")
    assert goal_res["remaining_amount"] == 40000.0
    assert goal_res["monthly_saving_required"] == 3333.33 or round(goal_res["monthly_saving_required"]) == 3333 or round(goal_res["monthly_saving_required"], 0) == 3334
    assert goal_res["percent_complete"] == 20.0

    # Test 3: Emergency Fund
    ef = calculate_emergency_fund_metrics(expenses, current)
    print(f"Emergency Fund: {ef}")
    assert ef["target"] == 21000.0  # 3 x 7000
    assert ef["remaining"] == 11000.0
    assert ef["percent_complete"] == round((10000 / 21000) * 100, 1)

    print("Financial Engine calculations verified!\n")

def test_database_and_schemes():
    print("--- 2. Testing Database and Scheme Matcher ---")
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
    print("--- 3. Testing AI Fallback Grounded Explanation ---")
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
    test_database_and_schemes()
    test_ai_fallback_explanation()
    print("ALL BACKEND VERIFICATIONS PASSED!")
