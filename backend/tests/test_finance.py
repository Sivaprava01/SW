"""
Unit & Integration Tests for Sakhi B3 Personal Finance, Transactions & Deterministic Engine.
"""

from fastapi.testclient import TestClient


def test_log_transaction_success(client: TestClient):
    """Test recording income and expense transactions for a user."""
    # Create user
    user_res = client.post("/api/v1/users", json={"name": "Lakshmi", "age": 28, "monthly_income": 12000, "monthly_expenses": 7000})
    user_id = user_res.json()["id"]

    # Log income transaction
    tx_in = {
        "amount": 1500.0,
        "type": "income",
        "category": "Tailoring",
        "description": "Blouse stitching orders"
    }
    res_in = client.post(f"/api/v1/users/{user_id}/transactions", json=tx_in)
    assert res_in.status_code == 201
    data_in = res_in.json()
    assert data_in["id"] is not None
    assert data_in["user_id"] == user_id
    assert data_in["amount"] == 1500.0
    assert data_in["type"] == "income"
    assert data_in["category"] == "Tailoring"

    # Log expense transaction
    tx_ex = {
        "amount": 450.0,
        "type": "expense",
        "category": "Groceries",
        "description": "Rice and lentils"
    }
    res_ex = client.post(f"/api/v1/users/{user_id}/transactions", json=tx_ex)
    assert res_ex.status_code == 201
    data_ex = res_ex.json()
    assert data_ex["amount"] == 450.0
    assert data_ex["type"] == "expense"


def test_log_transaction_validation_error(client: TestClient):
    """Test validation failure on negative amount or invalid type."""
    user_res = client.post("/api/v1/users", json={"name": "Lakshmi", "age": 28})
    user_id = user_res.json()["id"]

    # Amount <= 0
    res_invalid_amount = client.post(
        f"/api/v1/users/{user_id}/transactions",
        json={"amount": -100.0, "type": "expense", "category": "Food"}
    )
    assert res_invalid_amount.status_code == 422

    # Invalid type
    res_invalid_type = client.post(
        f"/api/v1/users/{user_id}/transactions",
        json={"amount": 100.0, "type": "transfer", "category": "Food"}
    )
    assert res_invalid_type.status_code == 422


def test_list_and_filter_transactions(client: TestClient):
    """Test listing user transactions with type filtering."""
    user_res = client.post("/api/v1/users", json={"name": "Kavitha", "age": 30})
    user_id = user_res.json()["id"]

    client.post(f"/api/v1/users/{user_id}/transactions", json={"amount": 3000.0, "type": "income", "category": "Dairy"})
    client.post(f"/api/v1/users/{user_id}/transactions", json={"amount": 500.0, "type": "expense", "category": "Transport"})
    client.post(f"/api/v1/users/{user_id}/transactions", json={"amount": 1200.0, "type": "expense", "category": "Medicines"})

    # All transactions
    all_res = client.get(f"/api/v1/users/{user_id}/transactions")
    assert all_res.status_code == 200
    assert len(all_res.json()) == 3

    # Filter expenses
    exp_res = client.get(f"/api/v1/users/{user_id}/transactions?type=expense")
    assert exp_res.status_code == 200
    assert len(exp_res.json()) == 2
    assert all(t["type"] == "expense" for t in exp_res.json())


def test_delete_transaction(client: TestClient):
    """Test deleting a transaction."""
    user_res = client.post("/api/v1/users", json={"name": "Sunita", "age": 35})
    user_id = user_res.json()["id"]

    tx_res = client.post(f"/api/v1/users/{user_id}/transactions", json={"amount": 750.0, "type": "expense", "category": "Fuel"})
    tx_id = tx_res.json()["id"]

    del_res = client.delete(f"/api/v1/users/{user_id}/transactions/{tx_id}")
    assert del_res.status_code == 204

    # Verify deleted
    list_res = client.get(f"/api/v1/users/{user_id}/transactions")
    assert len(list_res.json()) == 0


def test_financial_health_baseline_lakshmi(client: TestClient):
    """
    Test deterministic financial calculations on the official demo Lakshmi profile:
    Income: ₹12,000 | Expenses: ₹7,000 | Savings: ₹10,000 | Debt: ₹20,000
    Surplus = ₹5,000 | Savings Ratio = 41.7% | Health Status = "Healthy Surplus"
    Emergency Target = ₹21,000 (3 months) | Emergency Progress = 47.6%
    """
    lakshmi_res = client.get("/api/v1/users/demo/lakshmi")
    lakshmi_id = lakshmi_res.json()["id"]

    health_res = client.get(f"/api/v1/users/{lakshmi_id}/financial-health")
    assert health_res.status_code == 200
    data = health_res.json()

    assert data["monthly_income"] == 12000.0
    assert data["monthly_expenses"] == 7000.0
    assert data["monthly_surplus"] == 5000.0
    assert data["savings_ratio"] == 41.7
    assert data["expense_ratio"] == 58.3
    assert data["total_savings"] == 10000.0
    assert data["total_debt"] == 20000.0
    assert data["emergency_target"] == 21000.0
    assert data["emergency_progress_percentage"] == 47.6
    assert data["health_status"] == "Healthy Surplus"
    assert len(data["health_summary"]) > 0


def test_financial_health_status_tight_budget(client: TestClient):
    """Test Tight Budget status when surplus is between 5% and 29% of income."""
    # Income ₹10,000, Expenses ₹8,500 -> Surplus ₹1,500 (15%)
    user_res = client.post("/api/v1/users", json={
        "name": "Meena",
        "age": 30,
        "monthly_income": 10000.0,
        "monthly_expenses": 8500.0,
        "initial_savings": 2000.0,
        "initial_debt": 5000.0
    })
    user_id = user_res.json()["id"]

    health_res = client.get(f"/api/v1/users/{user_id}/financial-health")
    assert health_res.status_code == 200
    data = health_res.json()
    assert data["monthly_surplus"] == 1500.0
    assert data["savings_ratio"] == 15.0
    assert data["health_status"] == "Tight Budget"


def test_financial_health_status_deficit(client: TestClient):
    """Test Deficit status when expenses exceed income."""
    # Income ₹8,000, Expenses ₹9,500 -> Surplus ₹0
    user_res = client.post("/api/v1/users", json={
        "name": "Geeta",
        "age": 33,
        "monthly_income": 8000.0,
        "monthly_expenses": 9500.0,
        "initial_savings": 500.0,
        "initial_debt": 15000.0
    })
    user_id = user_res.json()["id"]

    health_res = client.get(f"/api/v1/users/{user_id}/financial-health")
    assert health_res.status_code == 200
    data = health_res.json()
    assert data["monthly_surplus"] == 0.0
    assert data["savings_ratio"] == 0.0
    assert data["health_status"] == "Negative Cashflow / Deficit"


def test_financial_health_with_logged_transactions_and_breakdown(client: TestClient):
    """Test that logging transactions dynamically updates surplus and computes category breakdowns."""
    user_res = client.post("/api/v1/users", json={"name": "Padma", "age": 29})
    user_id = user_res.json()["id"]

    # Log transactions
    client.post(f"/api/v1/users/{user_id}/transactions", json={"amount": 10000.0, "type": "income", "category": "Tailoring"})
    client.post(f"/api/v1/users/{user_id}/transactions", json={"amount": 4000.0, "type": "income", "category": "Dairy"})
    client.post(f"/api/v1/users/{user_id}/transactions", json={"amount": 3500.0, "type": "expense", "category": "Groceries"})
    client.post(f"/api/v1/users/{user_id}/transactions", json={"amount": 1500.0, "type": "expense", "category": "Utilities"})

    health_res = client.get(f"/api/v1/users/{user_id}/financial-health")
    assert health_res.status_code == 200
    data = health_res.json()

    assert data["monthly_income"] == 14000.0
    assert data["monthly_expenses"] == 5000.0
    assert data["monthly_surplus"] == 9000.0
    assert data["savings_ratio"] == 64.3
    assert len(data["income_breakdown"]) == 2
    assert len(data["expense_breakdown"]) == 2
    assert data["expense_breakdown"][0]["category"] == "Groceries"
    assert data["expense_breakdown"][0]["percentage"] == 70.0
