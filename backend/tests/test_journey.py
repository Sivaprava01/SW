"""
Unit & Integration Tests for Sakhi B6 7-Stage Financial Journey Engine.
"""

from fastapi.testclient import TestClient


def test_journey_roadmap_lakshmi(client: TestClient):
    """
    Test deterministic 7-stage roadmap calculation on official demo Lakshmi:
    - Stage 1: Daily Cashflow -> Completed (100.0%)
    - Stage 2: Emergency Shield -> In Progress (47.6% = ₹10,000 / ₹21,000)
    - Stage 3: High-Cost Debt -> In Progress (₹20,000 outstanding)
    - Current Active Stage -> Stage 2
    """
    lakshmi_res = client.get("/api/v1/users/demo/lakshmi")
    user_id = lakshmi_res.json()["id"]

    journey_res = client.get(f"/api/v1/users/{user_id}/journey")
    assert journey_res.status_code == 200
    data = journey_res.json()

    assert data["user_id"] == user_id
    assert data["total_stages"] == 7
    assert data["current_active_stage"] == 2
    assert len(data["stages"]) == 7

    stages = {s["stage_number"]: s for s in data["stages"]}
    
    # Stage 1: Cashflow
    assert stages[1]["status"] == "completed"
    assert stages[1]["progress_percentage"] == 100.0
    assert stages[1]["unlocked_badge"] == "Cashflow Champion"

    # Stage 2: Emergency Shield
    assert stages[2]["status"] == "in_progress"
    assert stages[2]["progress_percentage"] == 47.6
    assert "₹10,000" in stages[2]["target_metric_value"]

    # Stage 3: Debt Elimination
    assert stages[3]["status"] == "in_progress"
    assert "₹20,000" in stages[3]["target_metric_value"]


def test_journey_roadmap_fully_shielded_user(client: TestClient):
    """Test a user with complete emergency fund and zero debt advancing to Stage 4+."""
    user_res = client.post("/api/v1/users", json={
        "name": "Prabhavati",
        "age": 32,
        "monthly_income": 20000.0,
        "monthly_expenses": 8000.0,
        "initial_savings": 25000.0,  # > 3 months (₹24,000)
        "initial_debt": 0.0,
        "is_shg_member": True,
    })
    user_id = user_res.json()["id"]

    journey_res = client.get(f"/api/v1/users/{user_id}/journey")
    assert journey_res.status_code == 200
    data = journey_res.json()

    stages = {s["stage_number"]: s for s in data["stages"]}
    assert stages[1]["status"] == "completed"
    assert stages[2]["status"] == "completed"
    assert stages[3]["status"] == "completed"
    assert stages[5]["status"] == "completed"  # Insured SHG member
