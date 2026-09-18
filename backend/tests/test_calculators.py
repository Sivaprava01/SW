"""
Unit & Integration Tests for Sakhi B5 Deterministic Financial Calculators.
"""

from fastapi.testclient import TestClient


def test_emergency_fund_calculator(client: TestClient):
    """Test emergency fund buffer calculation (Suraksha Kavach)."""
    payload = {
        "monthly_expenses": 7000.0,
        "months_buffer": 3,
        "current_savings": 10000.0
    }
    response = client.post("/api/v1/calculators/emergency-fund", json=payload)
    assert response.status_code == 200
    data = response.json()

    assert data["emergency_target"] == 21000.0
    assert data["shortfall"] == 11000.0
    assert data["progress_percentage"] == 47.6
    assert data["safety_rating"] == "Partially Protected"
    assert len(data["plan_options"]) == 3
    # 3 months plan: 11000 / 3 = 3666.67
    assert data["plan_options"][0]["months"] == 3
    assert data["plan_options"][0]["monthly_savings_needed"] == 3666.67


def test_debt_refinance_calculator(client: TestClient):
    """
    Test moneylender vs SHG refinancing arbitrage calculator:
    Loan: ₹15,000
    Moneylender: 3% monthly (36% APR) -> ₹450/month
    SHG: 12% APR (1% monthly) -> ₹150/month
    Monthly Saved: ₹300/month | Annual Saved: ₹3,600 (66.7% interest reduction)
    """
    payload = {
        "loan_amount": 15000.0,
        "moneylender_monthly_rate": 3.0,
        "shg_annual_rate": 12.0,
        "tenure_months": 12
    }
    response = client.post("/api/v1/calculators/debt-refinance", json=payload)
    assert response.status_code == 200
    data = response.json()

    assert data["moneylender_apr"] == 36.0
    assert data["moneylender_monthly_interest"] == 450.0
    assert data["shg_monthly_interest"] == 150.0
    assert data["monthly_rupees_saved"] == 300.0
    assert data["total_tenure_rupees_saved"] == 3600.0
    assert data["interest_reduction_percentage"] == 66.7


def test_recurring_deposit_calculator(client: TestClient):
    """
    Test Post Office / Bank Recurring Deposit quarterly compounding calculator:
    Deposit: ₹1,000/month for 12 months at 6.7% p.a.
    Total Deposited: ₹12,000
    Maturity: ₹12,442.92 | Guaranteed Interest: ₹442.92
    """
    payload = {
        "monthly_deposit": 1000.0,
        "annual_interest_rate": 6.7,
        "tenure_months": 12
    }
    response = client.post("/api/v1/calculators/recurring-deposit", json=payload)
    assert response.status_code == 200
    data = response.json()

    assert data["total_deposited"] == 12000.0
    assert data["maturity_amount"] > 12400.0
    assert data["interest_earned"] > 400.0
    assert "Quarterly Compounded" in data["compounding_frequency"]


def test_goal_horizon_calculator(client: TestClient):
    """
    Test goal horizon and allocation calculator:
    Target: ₹50,000 | Saved: ₹10,000 | Remaining: ₹40,000 | Available Surplus: ₹5,000
    Target timeline: 12 months -> requires ₹3,333.33/mo (66.7% surplus utilization) -> Easily Achievable
    """
    payload = {
        "target_amount": 50000.0,
        "current_savings": 10000.0,
        "available_monthly_surplus": 5000.0,
        "target_months": 12
    }
    response = client.post("/api/v1/calculators/goal-horizon", json=payload)
    assert response.status_code == 200
    data = response.json()

    assert data["remaining_amount"] == 40000.0
    assert data["recommended_monthly_allocation"] == 3333.33
    assert data["surplus_utilization_percentage"] == 66.7
    assert data["is_feasible_in_target_timeline"] is True
    assert data["feasibility_status"] == "Easily Achievable"
