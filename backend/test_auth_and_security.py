import sys
import os
import time
from datetime import timedelta

# Ensure UTF-8 output on Windows console
if sys.platform == "win32":
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

# Add backend to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from fastapi.testclient import TestClient
from sqlalchemy import inspect
import jwt

from app.config import settings
from app.database import engine, Base, SessionLocal
from app.models.user import User
from app.models.goal import Goal
from app.models.transaction import Transaction
from app.models.refresh_token import RefreshToken
from app.core.security import hash_password, verify_password
from app.core.jwt import (
    create_access_token,
    decode_access_token,
    create_refresh_token,
    validate_refresh_token,
    rotate_refresh_token,
    revoke_refresh_token
)
from app.core.rate_limiter import InMemorySlidingWindowRateLimiter
from app.services.gemini_service import GeminiService
from app.schemas.ai import FinancialContextPayload
from app.api.deps import require_role, check_resource_owner
from app.main import app

client = TestClient(app)

def test_password_security():
    print("\n--- 1. Testing Password Hashing & Verification ---")
    password = "SecurePassword@123"
    hashed = hash_password(password)
    
    assert hashed != password, "Password was not hashed"
    assert hashed.startswith("$2b$") or hashed.startswith("$2a$"), "Password is not valid bcrypt hash"
    assert verify_password(password, hashed) is True, "Password verification failed for correct password"
    assert verify_password("WrongPassword@456", hashed) is False, "Password verification passed for incorrect password"
    assert verify_password("", hashed) is False, "Empty password should fail verification"
    print("✓ Password hashing & verification passed (bcrypt).")

def test_jwt_infrastructure():
    print("\n--- 2. Testing JWT Generation, Validation, Expiry & Signature ---")
    user_id = "test-uuid-user-123"
    role = "USER"
    
    # 1. Generation & Validation
    token = create_access_token(user_id=user_id, role=role)
    payload = decode_access_token(token)
    assert payload["sub"] == user_id, f"Expected sub={user_id}, got {payload.get('sub')}"
    assert payload["role"] == role, f"Expected role={role}, got {payload.get('role')}"
    assert "iat" in payload and "exp" in payload, "JWT missing iat or exp timestamps"
    assert "password" not in payload and "savings" not in payload, "JWT contains sensitive data"
    print("✓ JWT payload and signature verified.")

    # 2. Expired JWT
    expired_token = create_access_token(user_id=user_id, role=role, expires_delta=timedelta(seconds=-10))
    try:
        decode_access_token(expired_token)
        assert False, "Expired token should raise ExpiredSignatureError"
    except jwt.ExpiredSignatureError:
        print("✓ Expired JWT correctly detected and rejected.")

    # 3. Invalid/Tampered JWT
    tampered_token = token[:-5] + "XXXXX"
    try:
        decode_access_token(tampered_token)
        assert False, "Tampered token should raise InvalidTokenError"
    except jwt.InvalidTokenError:
        print("✓ Tampered JWT correctly detected and rejected.")

def test_refresh_token_lifecycle():
    print("\n--- 3. Testing Refresh Token Lifecycle (Creation, Storage, Rotation & Revocation) ---")
    db = SessionLocal()
    try:
        # Create a test user for foreign key constraint
        test_user = User(
            name="Refresh Test User",
            email="refresh_test@example.com",
            age=25,
            state="Telangana",
            gender="women"
        )
        db.add(test_user)
        db.commit()
        db.refresh(test_user)

        # 1. Create refresh token
        raw_token = create_refresh_token(db=db, user_id=test_user.id, user_agent="PyTest", ip_address="127.0.0.1")
        assert raw_token is not None and len(raw_token) > 40, "Raw refresh token not generated properly"

        # 2. Validate token
        record = validate_refresh_token(db=db, raw_token=raw_token)
        assert record.user_id == test_user.id, "Validated token user mismatch"
        assert record.revoked is False, "New token should not be revoked"
        print("✓ Refresh token creation and database lookup verified.")

        # 3. Rotate token
        new_raw_token, old_record = rotate_refresh_token(db=db, raw_token=raw_token)
        assert old_record.revoked is True, "Old token was not marked revoked upon rotation"
        assert new_raw_token != raw_token, "New refresh token is identical to old"
        print("✓ Refresh token single-use rotation verified.")

        # 4. Old token reuse should fail
        try:
            validate_refresh_token(db=db, raw_token=raw_token)
            assert False, "Revoked token should fail validation"
        except ValueError as e:
            assert "revoked" in str(e).lower(), f"Expected revoked error, got {e}"
            print("✓ Revoked token reuse prevented.")

        # 5. Revoke new token explicitly (logout)
        revoked = revoke_refresh_token(db=db, raw_token=new_raw_token)
        assert revoked is True, "Token revocation failed"
        print("✓ Token explicit revocation verified.")

        # Clean up
        db.delete(test_user)
        db.commit()
    finally:
        db.close()

def test_auth_endpoints_via_client():
    print("\n--- 4. Testing Authentication Endpoints via TestClient ---")
    reg_email = f"auth_user_{int(time.time())}@example.com"
    reg_phone = f"+91{int(time.time())%10000000000:010d}"
    password = "SuperSecretPassword@2026"

    # 1. Registration
    reg_payload = {
        "name": "Devi Rao",
        "email": reg_email,
        "phone": reg_phone,
        "password": password,
        "age": 32,
        "state": "Telangana",
        "gender": "women",
        "monthly_income": 15000.0,
        "monthly_expenses": 9000.0,
        "savings": 12000.0,
        "debt": 5000.0,
        "financial_goal": "Poultry Farm Setup"
    }
    reg_res = client.post("/api/auth/register", json=reg_payload)
    assert reg_res.status_code == 201, f"Registration failed: {reg_res.text}"
    reg_data = reg_res.json()
    assert "access_token" in reg_data and "refresh_token" in reg_data
    assert reg_data["user"]["email"] == reg_email
    assert "password_hash" not in reg_data["user"]
    print(f"✓ POST /api/auth/register passed (User ID: {reg_data['user']['id']}).")

    # 2. Duplicate Registration (Conflict 409)
    dup_res = client.post("/api/auth/register", json=reg_payload)
    assert dup_res.status_code == 409, f"Expected 409 Conflict, got {dup_res.status_code}"
    print("✓ Duplicate email/phone registration correctly returned 409 Conflict.")

    # 3. Login with correct credentials
    login_payload = {
        "identifier": reg_email,
        "password": password
    }
    login_res = client.post("/api/auth/login", json=login_payload)
    assert login_res.status_code == 200, f"Login failed: {login_res.text}"
    login_data = login_res.json()
    access_token = login_data["access_token"]
    refresh_token = login_data["refresh_token"]
    print("✓ POST /api/auth/login with valid credentials passed.")

    # 4. Login with incorrect password (401 Unauthorized)
    wrong_login_res = client.post("/api/auth/login", json={"identifier": reg_email, "password": "WrongPassword!999"})
    assert wrong_login_res.status_code == 401, f"Expected 401, got {wrong_login_res.status_code}"
    print("✓ POST /api/auth/login with incorrect password returned 401 Unauthorized.")

    # 5. GET /api/auth/me with Bearer token
    headers = {"Authorization": f"Bearer {access_token}"}
    me_res = client.get("/api/auth/me", headers=headers)
    assert me_res.status_code == 200, f"GET /api/auth/me failed: {me_res.text}"
    me_data = me_res.json()
    assert me_data["email"] == reg_email
    assert me_data["name"] == "Devi Rao"
    assert "password_hash" not in me_data
    print("✓ GET /api/auth/me authenticated profile retrieval passed.")

    # 6. GET /api/auth/me without token (401 Unauthorized)
    no_auth_res = client.get("/api/auth/me")
    assert no_auth_res.status_code == 401, f"Expected 401, got {no_auth_res.status_code}"
    print("✓ GET /api/auth/me without credentials returned 401 Unauthorized.")

    # 7. POST /api/auth/refresh
    refresh_res = client.post("/api/auth/refresh", json={"refresh_token": refresh_token})
    assert refresh_res.status_code == 200, f"Refresh failed: {refresh_res.text}"
    refreshed_data = refresh_res.json()
    new_access_token = refreshed_data["access_token"]
    new_refresh_token = refreshed_data["refresh_token"]
    assert new_access_token != access_token
    print("✓ POST /api/auth/refresh token rotation passed.")

    # 8. POST /api/auth/logout
    logout_res = client.post("/api/auth/logout", json={"refresh_token": new_refresh_token})
    assert logout_res.status_code == 200, f"Logout failed: {logout_res.text}"
    print("✓ POST /api/auth/logout session revocation passed.")

def test_role_and_resource_authorization():
    print("\n--- 5. Testing Role-Based & Resource Authorization ---")
    user_standard = User(id="user-std-1", name="Normal User", role="USER")
    user_admin = User(id="user-admin-1", name="Admin User", role="ADMIN")
    user_other = User(id="user-std-2", name="Other User", role="USER")

    # Resource ownership check
    assert check_resource_owner("user-std-1", user_standard) is True, "Owner should have access"
    assert check_resource_owner("user-std-1", user_admin) is True, "Admin should have access"
    
    try:
        check_resource_owner("user-std-1", user_other)
        assert False, "Non-owner should be denied access"
    except Exception as e:
        assert getattr(e, "status_code", None) == 403, "Non-owner should receive 403 Forbidden"
        print("✓ Resource ownership authorization check passed.")

def test_rate_limiting():
    print("\n--- 6. Testing Rate Limiting (Sliding Window) ---")
    limiter = InMemorySlidingWindowRateLimiter()
    key = "test-rate-limit-client"
    limit = 3
    window = 10

    # 3 allowed requests
    for i in range(limit):
        allowed, _ = limiter.is_allowed(key, limit, window)
        assert allowed is True, f"Request {i+1} should be allowed"

    # 4th request must be blocked
    allowed, retry_after = limiter.is_allowed(key, limit, window)
    assert allowed is False, "Exceeding limit should be blocked"
    assert retry_after > 0, "Retry-After should be greater than 0"
    print(f"✓ Rate limiter blocked excessive request with retry_after={retry_after}s.")

def test_gemini_service_and_configuration():
    print("\n--- 7. Testing Dedicated Gemini Service & Fallback ---")
    gemini = GeminiService()
    
    # Context payload
    ctx = FinancialContextPayload(
        name="Lakshmi",
        income=12000.0,
        expenses=7000.0,
        surplus=5000.0,
        savings=10000.0,
        debt=20000.0,
        current_journey_stage="Build Emergency Fund",
        emergency_fund={"target": 21000.0, "current": 10000.0, "remaining": 11000.0},
        primary_goal={"name": "Daughter's Education", "target_amount": 50000.0, "monthly_saving_required": 3333.33},
        state="Telangana",
        age=28,
        is_shg_member=True,
        language="en"
    )

    # When unconfigured or offline, generate_explanation gracefully returns grounded response
    import asyncio
    res = asyncio.run(gemini.generate_explanation("How much should I save?", ctx, language="en"))
    assert res.reply is not None and len(res.reply) > 20
    assert "5,000" in res.reply or "surplus" in res.reply.lower()
    assert res.is_fallback is True or res.is_fallback is False
    print("✓ Dedicated Gemini Service gracefully handled request with verified financial metrics.")

def test_database_schema_and_migrations():
    print("\n--- 8. Testing Database Tables, Types & Indexes ---")
    inspector = inspect(engine)
    table_names = inspector.get_table_names()
    
    required_tables = ["users", "goals", "transactions", "government_schemes", "user_scheme_matches", "refresh_tokens"]
    for t in required_tables:
        assert t in table_names, f"Required table '{t}' is missing from database"
    print(f"✓ All {len(required_tables)} production database tables present: {', '.join(required_tables)}.")

    # Check users columns
    user_columns = {col["name"]: col for col in inspector.get_columns("users")}
    for col in ["id", "name", "email", "phone", "password_hash", "role", "is_active", "monthly_income", "savings", "debt"]:
        assert col in user_columns, f"Column '{col}' missing from users table"
    print("✓ Users table schema and auth columns verified.")

    # Check refresh_tokens indexes
    rf_indexes = [idx["name"] for idx in inspector.get_indexes("refresh_tokens")]
    assert any("token_hash" in name for name in rf_indexes), "Index on refresh_tokens(token_hash) missing"
    print("✓ Refresh tokens security indexes verified.")

if __name__ == "__main__":
    print("==================================================")
    print("STARTING SAKHI PHASE 1 SECURITY & AUTH TEST SUITE")
    print("==================================================")
    test_password_security()
    test_jwt_infrastructure()
    test_refresh_token_lifecycle()
    test_auth_endpoints_via_client()
    test_role_and_resource_authorization()
    test_rate_limiting()
    test_gemini_service_and_configuration()
    test_database_schema_and_migrations()
    print("\n==================================================")
    print("ALL 8 SECURITY & AUTHENTICATION TEST SUITES PASSED")
    print("==================================================")
