"""
Unit & Integration Tests for Sakhi B4 Goals Domain & Deterministic Savings Math.
"""

from fastapi.testclient import TestClient


def test_create_goal_success(client: TestClient):
    """Test creating a new savings goal with deterministic monthly calculation."""
    # Create user
    user_res = client.post("/api/v1/users", json={"name": "Lakshmi", "age": 28})
    user_id = user_res.json()["id"]

    goal_payload = {
        "name": "Daughter's College Admission",
        "target_amount": 50000.0,
        "current_amount": 10000.0,
        "target_months": 12,
        "category": "Education",
        "priority": 1
    }
    response = client.post(f"/api/v1/users/{user_id}/goals", json=goal_payload)
    assert response.status_code == 201
    data = response.json()

    assert data["id"] is not None
    assert data["user_id"] == user_id
    assert data["name"] == "Daughter's College Admission"
    assert data["target_amount"] == 50000.0
    assert data["current_amount"] == 10000.0
    assert data["remaining_amount"] == 40000.0
    assert data["progress_percentage"] == 20.0
    assert data["required_monthly_savings"] == 3333.33
    assert data["is_completed"] is False


def test_deposit_to_goal(client: TestClient):
    """Test making savings deposits towards a goal."""
    user_res = client.post("/api/v1/users", json={"name": "Lakshmi", "age": 28})
    user_id = user_res.json()["id"]

    # Create goal with ₹10,000 / ₹50,000
    goal_res = client.post(f"/api/v1/users/{user_id}/goals", json={
        "name": "Sewing Machine",
        "target_amount": 15000.0,
        "current_amount": 5000.0,
        "target_months": 10
    })
    goal_id = goal_res.json()["id"]

    # Deposit ₹5,000
    dep_res = client.post(f"/api/v1/users/{user_id}/goals/{goal_id}/deposit", json={"amount": 5000.0})
    assert dep_res.status_code == 200
    data = dep_res.json()
    assert data["current_amount"] == 10000.0
    assert data["remaining_amount"] == 5000.0
    assert data["progress_percentage"] == 66.7
    assert data["required_monthly_savings"] == 500.0
    assert data["is_completed"] is False

    # Deposit remaining ₹5,000 to complete goal
    comp_res = client.post(f"/api/v1/users/{user_id}/goals/{goal_id}/deposit", json={"amount": 5000.0})
    assert comp_res.status_code == 200
    comp_data = comp_res.json()
    assert comp_data["current_amount"] == 15000.0
    assert comp_data["remaining_amount"] == 0.0
    assert comp_data["progress_percentage"] == 100.0
    assert comp_data["required_monthly_savings"] == 0.0
    assert comp_data["is_completed"] is True


def test_list_and_update_goals(client: TestClient):
    """Test listing and patching goals."""
    user_res = client.post("/api/v1/users", json={"name": "Ananya", "age": 26})
    user_id = user_res.json()["id"]

    client.post(f"/api/v1/users/{user_id}/goals", json={"name": "Goal 1", "target_amount": 10000.0, "priority": 2})
    goal2_res = client.post(f"/api/v1/users/{user_id}/goals", json={"name": "Goal 2", "target_amount": 20000.0, "priority": 1})
    goal2_id = goal2_res.json()["id"]

    # List
    list_res = client.get(f"/api/v1/users/{user_id}/goals")
    assert list_res.status_code == 200
    goals = list_res.json()
    assert len(goals) == 2
    assert goals[0]["priority"] == 1  # Sorted by priority

    # Update Goal 2 timeline to 20 months
    update_res = client.patch(f"/api/v1/users/{user_id}/goals/{goal2_id}", json={"target_months": 20})
    assert update_res.status_code == 200
    assert update_res.json()["target_months"] == 20
    assert update_res.json()["required_monthly_savings"] == 1000.0


def test_delete_goal(client: TestClient):
    """Test deleting a goal."""
    user_res = client.post("/api/v1/users", json={"name": "Radha", "age": 30})
    user_id = user_res.json()["id"]

    goal_res = client.post(f"/api/v1/users/{user_id}/goals", json={"name": "Temp Goal", "target_amount": 5000.0})
    goal_id = goal_res.json()["id"]

    del_res = client.delete(f"/api/v1/users/{user_id}/goals/{goal_id}")
    assert del_res.status_code == 204

    # Verify 404
    get_res = client.get(f"/api/v1/users/{user_id}/goals/{goal_id}")
    assert get_res.status_code == 404
