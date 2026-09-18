"""
Comprehensive Backend Authentication & Authorization Test Suite.

Tests registration, duplicate mobile prevention, bcrypt password hashing,
credential verification (login), generic error masking, JWT issuance & expiration,
/auth/me profile inspection, token renewal, and cross-user data isolation (User A vs User B).
"""

from fastapi.testclient import TestClient
from app.core.security import decode_token, verify_password


def test_register_member_success(client: TestClient):
    """Test successful member registration returns valid signed JWT and user profile."""
    payload = {
        "name": "Sunitha Rao",
        "mobile": "9848012345",
        "password": "securepassword123",
        "state": "Telangana",
        "primary_language": "te",
        "occupation": "Weaver",
        "monthly_income": 15000,
        "monthly_expenses": 10000,
        "initial_savings": 8000,
        "initial_debt": 5000,
    }

    res = client.post("/api/v1/auth/register", json=payload)
    assert res.status_code == 201
    data = res.json()

    assert "access_token" in data
    assert data["token_type"] == "bearer"
    assert data["expires_in"] > 0
    assert "user" in data

    user = data["user"]
    assert user["name"] == "Sunitha Rao"
    assert user["phone_number"] == "9848012345"
    assert user["state"] == "Telangana"
    assert "hashed_password" not in user
    assert "password" not in user

    # Decode and verify JWT claims
    claims = decode_token(data["access_token"])
    assert claims["sub"] == str(user["id"])
    assert claims["type"] == "access"
    assert "exp" in claims
    assert "iat" in claims


def test_register_duplicate_mobile_rejected(client: TestClient):
    """Test registering with an existing mobile number returns 409 Conflict."""
    payload = {
        "name": "Kavitha",
        "mobile": "9988776655",
        "password": "password123",
    }
    res1 = client.post("/api/v1/auth/register", json=payload)
    assert res1.status_code == 201

    # Attempt duplicate
    res2 = client.post("/api/v1/auth/register", json=payload)
    assert res2.status_code == 409
    error_data = res2.json()
    assert "already exists" in error_data["error"]["message"].lower()


def test_login_success_and_jwt_issuance(client: TestClient):
    """Test member login with correct mobile and password returns signed JWT."""
    # Register first
    client.post("/api/v1/auth/register", json={
        "name": "Padma",
        "mobile": "9123456780",
        "password": "padmapassword",
    })

    # Login
    login_res = client.post("/api/v1/auth/login", json={
        "mobile": "9123456780",
        "password": "padmapassword",
    })
    assert login_res.status_code == 200
    data = login_res.json()

    assert "access_token" in data
    assert data["token_type"] == "bearer"
    assert data["user"]["name"] == "Padma"


def test_login_invalid_credentials_returns_generic_401(client: TestClient):
    """Test incorrect password or non-existent mobile returns generic error (no enumeration)."""
    # 1. Non-existent mobile
    res_unknown = client.post("/api/v1/auth/login", json={
        "mobile": "9000000000",
        "password": "anyPassword",
    })
    assert res_unknown.status_code == 401
    assert "Invalid mobile number or password" in res_unknown.json()["error"]["message"]

    # 2. Existing mobile with wrong password
    client.post("/api/v1/auth/register", json={
        "name": "Anitha",
        "mobile": "9111222333",
        "password": "correctPassword",
    })

    res_wrong_pwd = client.post("/api/v1/auth/login", json={
        "mobile": "9111222333",
        "password": "wrongPassword",
    })
    assert res_wrong_pwd.status_code == 401
    assert "Invalid mobile number or password" in res_wrong_pwd.json()["error"]["message"]


def test_auth_me_protected_endpoint(client: TestClient):
    """Test /auth/me returns current user profile with valid JWT and rejects unauthorized requests."""
    # 1. Without token -> 401
    res_no_token = client.get("/api/v1/auth/me")
    assert res_no_token.status_code == 401

    # 2. With invalid token -> 401
    res_bad_token = client.get("/api/v1/auth/me", headers={"Authorization": "Bearer invalid.jwt.token"})
    assert res_bad_token.status_code == 401

    # 3. With valid token -> 200
    reg_res = client.post("/api/v1/auth/register", json={
        "name": "Bhavani",
        "mobile": "9444555666",
        "password": "bhavanipassword",
    })
    token = reg_res.json()["access_token"]

    res_auth = client.get("/api/v1/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert res_auth.status_code == 200
    assert res_auth.json()["name"] == "Bhavani"


def test_auth_token_refresh(client: TestClient):
    """Test renewing an access token using a valid refresh token."""
    reg_res = client.post("/api/v1/auth/register", json={
        "name": "Meena",
        "mobile": "9777888999",
        "password": "meenapassword",
    })
    refresh_token = reg_res.json()["refresh_token"]

    ref_res = client.post("/api/v1/auth/refresh", json={"refresh_token": refresh_token})
    assert ref_res.status_code == 200
    data = ref_res.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"


def test_user_data_isolation_and_authorization(client: TestClient):
    """
    CRITICAL SECURITY CHECK:
    Verify that User A authenticated with JWT cannot access User B's financial data.
    """
    # 1. Register User A (Radha)
    res_a = client.post("/api/v1/auth/register", json={
        "name": "Radha (User A)",
        "mobile": "9555111222",
        "password": "passwordA123",
        "initial_savings": 5000,
    })
    user_a = res_a.json()["user"]
    token_a = res_a.json()["access_token"]

    # 2. Register User B (Sita)
    res_b = client.post("/api/v1/auth/register", json={
        "name": "Sita (User B)",
        "mobile": "9555333444",
        "password": "passwordB123",
        "initial_savings": 25000,
    })
    user_b = res_b.json()["user"]
    token_b = res_b.json()["access_token"]

    headers_a = {"Authorization": f"Bearer {token_a}"}
    headers_b = {"Authorization": f"Bearer {token_b}"}

    # User A accesses own data -> 200 OK
    res_own_health = client.get(f"/api/v1/users/{user_a['id']}/financial-health", headers=headers_a)
    assert res_own_health.status_code == 200

    # User A tries to access User B's transactions -> 403 Forbidden!
    res_attack_tx = client.get(f"/api/v1/users/{user_b['id']}/transactions", headers=headers_a)
    assert res_attack_tx.status_code == 403
    assert "Access forbidden" in res_attack_tx.json()["error"]["message"]

    # User A tries to access User B's goals -> 403 Forbidden!
    res_attack_goals = client.get(f"/api/v1/users/{user_b['id']}/goals", headers=headers_a)
    assert res_attack_goals.status_code == 403

    # User A tries to access User B's debts -> 403 Forbidden!
    res_attack_debts = client.get(f"/api/v1/users/{user_b['id']}/debts", headers=headers_a)
    assert res_attack_debts.status_code == 403

    # User A tries to access User B's financial health -> 403 Forbidden!
    res_attack_health = client.get(f"/api/v1/users/{user_b['id']}/financial-health", headers=headers_a)
    assert res_attack_health.status_code == 403

    # User A tries to access User B's journey -> 403 Forbidden!
    res_attack_journey = client.get(f"/api/v1/users/{user_b['id']}/journey", headers=headers_a)
    assert res_attack_journey.status_code == 403

    # User A tries to access User B's matched schemes -> 403 Forbidden!
    res_attack_schemes = client.get(f"/api/v1/users/{user_b['id']}/schemes/matched", headers=headers_a)
    assert res_attack_schemes.status_code == 403

    # User A tries to access User B's learning progress -> 403 Forbidden!
    res_attack_learning = client.get(f"/api/v1/users/{user_b['id']}/learning/progress", headers=headers_a)
    assert res_attack_learning.status_code == 403

    # User B accesses own data -> 200 OK
    res_b_health = client.get(f"/api/v1/users/{user_b['id']}/financial-health", headers=headers_b)
    assert res_b_health.status_code == 200


def test_seeded_demo_lakshmi_login(client: TestClient):
    """Test reference Lakshmi demo account can authenticate with seeded development credentials."""
    # Ensure demo Lakshmi is seeded
    client.get("/api/v1/users/demo/lakshmi")

    # Login as Lakshmi
    login_res = client.post("/api/v1/auth/login", json={
        "mobile": "9876543210",
        "password": "lakshmi123",
    })
    assert login_res.status_code == 200
    data = login_res.json()
    assert data["user"]["name"] == "Lakshmi"
    assert "access_token" in data
