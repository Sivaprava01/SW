"""
Unit & Integration Tests for Sakhi B2 Users & Personalization Domain.
"""

from fastapi.testclient import TestClient


def test_create_user_success(client: TestClient):
    """Test creating a new user profile via POST /api/v1/users."""
    payload = {
        "name": "Sita Devi",
        "phone_number": "9123456789",
        "age": 30,
        "gender": "female",
        "state": "Andhra Pradesh",
        "district": "Guntur",
        "locality_type": "rural",
        "primary_language": "te",
        "is_shg_member": True,
        "shg_name": "Saraswati Sangham",
        "occupation": "Dairy Farmer",
        "monthly_income": 15000.0,
        "monthly_expenses": 8500.0,
        "initial_savings": 5000.0,
        "initial_debt": 10000.0
    }
    response = client.post("/api/v1/users", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["id"] is not None
    assert data["name"] == "Sita Devi"
    assert data["state"] == "Andhra Pradesh"
    assert data["is_shg_member"] is True
    assert data["monthly_income"] == 15000.0
    assert data["monthly_expenses"] == 8500.0
    assert "created_at" in data
    assert "updated_at" in data


def test_create_user_validation_error(client: TestClient):
    """Test validation errors for invalid user payload (e.g. invalid age < 14)."""
    payload = {
        "name": "Young Child",
        "age": 10,  # Invalid: ge=14 required
        "state": "Telangana"
    }
    response = client.post("/api/v1/users", json=payload)
    assert response.status_code == 422
    data = response.json()
    assert data["status"] == "error"
    assert data["error"]["code"] == "VALIDATION_ERROR"


def test_get_user_by_id(client: TestClient):
    """Test retrieving an existing user profile."""
    # Create user first
    create_res = client.post("/api/v1/users", json={"name": "Ananya", "age": 26, "state": "Telangana"})
    user_id = create_res.json()["id"]

    # Fetch user
    response = client.get(f"/api/v1/users/{user_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == user_id
    assert data["name"] == "Ananya"
    assert data["age"] == 26


def test_get_user_not_found(client: TestClient):
    """Test 404 response for non-existent user."""
    response = client.get("/api/v1/users/999999")
    assert response.status_code == 404
    data = response.json()
    assert data["status"] == "error"
    assert data["error"]["code"] == "RESOURCE_NOT_FOUND"


def test_update_user(client: TestClient):
    """Test updating user demographics and language preference."""
    create_res = client.post("/api/v1/users", json={"name": "Radha", "age": 32, "primary_language": "te"})
    user_id = create_res.json()["id"]

    # Update language to Hindi and add SHG details
    update_res = client.patch(
        f"/api/v1/users/{user_id}",
        json={
            "primary_language": "hi",
            "is_shg_member": True,
            "shg_name": "Radha Krishna SHG",
            "monthly_income": 18000.0
        }
    )
    assert update_res.status_code == 200
    data = update_res.json()
    assert data["primary_language"] == "hi"
    assert data["is_shg_member"] is True
    assert data["shg_name"] == "Radha Krishna SHG"
    assert data["monthly_income"] == 18000.0


def test_delete_user(client: TestClient):
    """Test deleting a user profile."""
    create_res = client.post("/api/v1/users", json={"name": "Temporary User", "age": 40})
    user_id = create_res.json()["id"]

    # Delete
    del_res = client.delete(f"/api/v1/users/{user_id}")
    assert del_res.status_code == 204

    # Verify not found
    get_res = client.get(f"/api/v1/users/{user_id}")
    assert get_res.status_code == 404


def test_get_demo_lakshmi_user(client: TestClient):
    """Test the reference demo Lakshmi endpoint GET /api/v1/users/demo/lakshmi."""
    response = client.get("/api/v1/users/demo/lakshmi")
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Lakshmi"
    assert data["age"] == 28
    assert data["state"] == "Telangana"
    assert data["locality_type"] == "rural"
    assert data["primary_language"] == "te"
    assert data["is_shg_member"] is True
    assert data["monthly_income"] == 12000.0
    assert data["monthly_expenses"] == 7000.0
    assert data["initial_savings"] == 10000.0
    assert data["initial_debt"] == 20000.0


def test_list_users(client: TestClient):
    """Test listing users with pagination."""
    # Seed at least 2 users
    client.post("/api/v1/users", json={"name": "User 1", "age": 22})
    client.post("/api/v1/users", json={"name": "User 2", "age": 24})

    response = client.get("/api/v1/users?skip=0&limit=10")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 2
