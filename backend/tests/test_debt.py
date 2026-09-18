"""
Unit & Integration Tests for Sakhi B4 Debt Management & Snowball Payoff Engine.
"""

from fastapi.testclient import TestClient


def test_record_debt_success(client: TestClient):
    """Test recording a debt liability with auto-calculated interest drain."""
    user_res = client.post("/api/v1/users", json={"name": "Lakshmi", "age": 28})
    user_id = user_res.json()["id"]

    debt_payload = {
        "lender_name": "Village Moneylender (Raju)",
        "lender_type": "moneylender",
        "principal_amount": 15000.0,
        "current_balance": 15000.0,
        "monthly_interest_rate": 3.0,  # 3% per month
        "monthly_emi_payment": 450.0,
        "notes": "Emergency hospital loan"
    }
    response = client.post(f"/api/v1/users/{user_id}/debts", json=debt_payload)
    assert response.status_code == 201
    data = response.json()

    assert data["id"] is not None
    assert data["user_id"] == user_id
    assert data["lender_name"] == "Village Moneylender (Raju)"
    assert data["current_balance"] == 15000.0
    assert data["monthly_interest_rate"] == 3.0
    assert data["annual_interest_rate"] == 36.0
    assert data["monthly_interest_drain"] == 450.0
    assert data["is_cleared"] is False


def test_update_and_clear_debt(client: TestClient):
    """Test updating debt balance and verifying auto-clear when balance reaches 0."""
    user_res = client.post("/api/v1/users", json={"name": "Sita", "age": 30})
    user_id = user_res.json()["id"]

    debt_res = client.post(f"/api/v1/users/{user_id}/debts", json={
        "lender_name": "Fertilizer Shop",
        "lender_type": "moneylender",
        "principal_amount": 6000.0,
        "current_balance": 6000.0,
        "monthly_interest_rate": 2.5
    })
    debt_id = debt_res.json()["id"]

    # Partial payment
    patch_res = client.patch(f"/api/v1/users/{user_id}/debts/{debt_id}", json={"current_balance": 2000.0})
    assert patch_res.status_code == 200
    assert patch_res.json()["current_balance"] == 2000.0
    assert patch_res.json()["monthly_interest_drain"] == 50.0
    assert patch_res.json()["is_cleared"] is False

    # Complete payment
    clear_res = client.patch(f"/api/v1/users/{user_id}/debts/{debt_id}", json={"current_balance": 0.0})
    assert clear_res.status_code == 200
    assert clear_res.json()["current_balance"] == 0.0
    assert clear_res.json()["is_cleared"] is True


def test_snowball_and_shg_refinancing_analysis(client: TestClient):
    """
    Test deterministic debt snowball calculations and SHG refinancing arbitrage:
    Debt 1: Moneylender ₹15,000 at 3% monthly (36% APR) -> ₹450 interest/mo
    Debt 2: SHG Micro-Loan ₹5,000 at 1% monthly (12% APR) -> ₹50 interest/mo
    Total Balance: ₹20,000 | Total Interest Drain: ₹500/mo
    Informal Balance: ₹15,000 | Informal Interest: ₹450/mo
    SHG Hypothetical Interest (1%): ₹150/mo
    Potential Monthly Refinance Savings: ₹450 - ₹150 = ₹300/mo (₹3,600/yr)
    Snowball Payoff Order: SHG (₹5,000) rank 1, Moneylender (₹15,000) rank 2
    Avalanche Payoff Order: Moneylender (36%) rank 1, SHG (12%) rank 2
    """
    user_res = client.post("/api/v1/users", json={"name": "Lakshmi", "age": 28, "primary_language": "te"})
    user_id = user_res.json()["id"]

    # Log 2 debts
    client.post(f"/api/v1/users/{user_id}/debts", json={
        "lender_name": "Private Moneylender",
        "lender_type": "moneylender",
        "principal_amount": 15000.0,
        "current_balance": 15000.0,
        "monthly_interest_rate": 3.0,
    })
    client.post(f"/api/v1/users/{user_id}/debts", json={
        "lender_name": "Stree Nidhi SHG Loan",
        "lender_type": "shg",
        "principal_amount": 5000.0,
        "current_balance": 5000.0,
        "monthly_interest_rate": 1.0,
    })

    analysis_res = client.get(f"/api/v1/users/{user_id}/debts-analysis/snowball")
    assert analysis_res.status_code == 200
    data = analysis_res.json()

    assert data["total_debt_balance"] == 20000.0
    assert data["total_monthly_interest_drain"] == 500.0
    assert data["informal_debt_balance"] == 15000.0
    assert data["informal_monthly_interest"] == 450.0
    assert data["potential_shg_refinance_monthly_savings"] == 300.0
    assert data["potential_annual_refinance_savings"] == 3600.0

    # Snowball order: smallest balance first (₹5,000 -> ₹15,000)
    assert len(data["debts_snowball_order"]) == 2
    assert data["debts_snowball_order"][0]["lender_name"] == "Stree Nidhi SHG Loan"
    assert data["debts_snowball_order"][0]["current_balance"] == 5000.0
    assert data["debts_snowball_order"][0]["payoff_priority_rank"] == 1

    # Avalanche order: highest interest rate first (36% -> 12%)
    assert len(data["debts_avalanche_order"]) == 2
    assert data["debts_avalanche_order"][0]["lender_name"] == "Private Moneylender"
    assert data["debts_avalanche_order"][0]["annual_interest_rate"] == 36.0
    assert data["debts_avalanche_order"][0]["payoff_priority_rank"] == 1

    assert len(data["actionable_recommendation"]) > 0


def test_delete_debt(client: TestClient):
    """Test deleting a debt record."""
    user_res = client.post("/api/v1/users", json={"name": "Kavitha", "age": 35})
    user_id = user_res.json()["id"]

    debt_res = client.post(f"/api/v1/users/{user_id}/debts", json={
        "lender_name": "Temp Loan",
        "principal_amount": 2000.0,
        "current_balance": 2000.0
    })
    debt_id = debt_res.json()["id"]

    del_res = client.delete(f"/api/v1/users/{user_id}/debts/{debt_id}")
    assert del_res.status_code == 204

    # Verify 404
    get_res = client.get(f"/api/v1/users/{user_id}/debts/{debt_id}")
    assert get_res.status_code == 404
