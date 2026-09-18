"""
Unit & Integration Tests for Sakhi B8 Ask Sakhi AI Companion & Grounding.

Tests financial grounding context assembly, safety guardrails, anti-speculation filters,
multilingual chat responses, and universal concept explanations.
"""

from fastapi.testclient import TestClient


def test_get_user_grounding_context(client: TestClient):
    """Test gathering live deterministic financial metrics for AI grounding."""
    # 1. Create Lakshmi profile with realistic data
    user_res = client.post(
        "/api/v1/users",
        json={
            "name": "Lakshmi",
            "age": 28,
            "gender": "female",
            "state": "Telangana",
            "locality_type": "rural",
            "is_shg_member": True,
            "shg_name": "Gramashakti Sangham",
            "monthly_income": 15000.0,
            "monthly_expenses": 7000.0,
            "initial_savings": 5000.0,
        },
    )
    assert user_res.status_code == 201
    user_id = user_res.json()["id"]

    # 2. Add high-interest debt
    client.post(
        f"/api/v1/users/{user_id}/debts",
        json={
            "lender_name": "Local Moneylender",
            "lender_type": "moneylender",
            "principal_amount": 20000.0,
            "current_balance": 20000.0,
            "monthly_interest_rate": 3.0,
            "monthly_emi_payment": 600.0,
        },
    )

    # 3. Retrieve grounding metrics
    grounding_res = client.get(f"/api/v1/ai/grounding/{user_id}")
    assert grounding_res.status_code == 200
    data = grounding_res.json()

    assert data["user_name"] == "Lakshmi"
    assert data["monthly_income"] == 15000.0
    assert data["monthly_expenses"] == 7000.0
    assert data["monthly_surplus"] == 8000.0
    assert data["emergency_fund_target"] == 21000.0  # 3 * 7000
    assert data["total_debt"] == 20000.0
    assert data["monthly_interest_drain"] == 600.0  # 3% of 20,000
    assert data["matched_schemes_count"] >= 5
    assert data["is_shg_member"] is True


def test_ai_safety_guardrail_speculative_rejection(client: TestClient):
    """Test AI companion strictly blocks crypto/lottery/speculative queries."""
    user_res = client.post("/api/v1/users", json={"name": "Anita", "age": 25})
    user_id = user_res.json()["id"]

    # Query with speculative cryptocurrency keyword
    chat_res = client.post(
        "/api/v1/ai/chat",
        json={
            "user_id": user_id,
            "message": "Should I invest my savings in Bitcoin or crypto trading?",
            "language": "en",
        },
    )
    assert chat_res.status_code == 200
    data = chat_res.json()
    assert data["is_fallback"] is True
    assert "does not provide guidance on cryptocurrencies" in data["reply"]
    assert "emergency safety buffer" in data["reply"]


def test_ai_chat_emergency_shield_multilingual(client: TestClient):
    """Test conversational answers on Emergency Shield in English, Telugu, and Hindi."""
    user_res = client.post(
        "/api/v1/users",
        json={
            "name": "Lakshmi",
            "age": 28,
            "gender": "female",
            "state": "Telangana",
            "monthly_income": 15000.0,
            "monthly_expenses": 7000.0,
            "initial_savings": 5000.0,
        },
    )
    user_id = user_res.json()["id"]

    # 1. English
    en_res = client.post(
        "/api/v1/ai/chat",
        json={
            "user_id": user_id,
            "message": "What is my Emergency Shield buffer target?",
            "language": "en",
        },
    )
    assert en_res.status_code == 200
    assert "21,000" in en_res.json()["reply"]
    assert any(w in en_res.json()["reply"] for w in ["5,000", "7,000", "8,000", "23.8%", "3 months", "3-month"])
    assert len(en_res.json()["suggested_followups"]) > 0


    # 2. Telugu
    te_res = client.post(
        "/api/v1/ai/chat",
        json={
            "user_id": user_id,
            "message": "నా అత్యవసర రక్షణ నిధి ఎంత ఉండాలి?",
            "language": "te",
        },
    )
    assert te_res.status_code == 200
    assert "21,000" in te_res.json()["reply"]
    assert any(w in te_res.json()["reply"] for w in ["లక్ష్యం", "నిధి", "రక్షణ", "కవచం", "రూపాయలు", "అత్యవసర"])

    # 3. Hindi
    hi_res = client.post(
        "/api/v1/ai/chat",
        json={
            "user_id": user_id,
            "message": "मेरा सुरक्षा कवच लक्ष्य कितना है?",
            "language": "hi",
        },
    )
    assert hi_res.status_code == 200
    assert "21,000" in hi_res.json()["reply"]
    assert "सुरक्षा कवच" in hi_res.json()["reply"]


def test_ai_chat_debt_refinance_advice(client: TestClient):
    """Test AI companion identifies high moneylender interest and advises SHG refinancing."""
    user_res = client.post("/api/v1/users", json={"name": "Lakshmi", "age": 28})
    user_id = user_res.json()["id"]

    # Add private moneylender debt
    client.post(
        f"/api/v1/users/{user_id}/debts",
        json={
            "lender_name": "Village Sahukar",
            "lender_type": "moneylender",
            "principal_amount": 30000.0,
            "current_balance": 30000.0,
            "monthly_interest_rate": 4.0,  # 48% APR
            "monthly_emi_payment": 1200.0,
        },
    )

    chat_res = client.post(
        "/api/v1/ai/chat",
        json={
            "user_id": user_id,
            "message": "How can I escape this moneylender loan?",
            "language": "en",
        },
    )
    assert chat_res.status_code == 200
    reply = chat_res.json()["reply"]
    assert "30,000" in reply
    assert any(w in reply.lower() for w in ["sahukar", "moneylender", "lender", "loan", "debt", "48%"])
    assert any(w in reply.lower() for w in ["shg", "sangham", "mudra", "bank", "refinanc"])



def test_ai_chat_government_schemes_advice(client: TestClient):
    """Test AI companion surfaces top matched welfare programs."""
    user_res = client.post(
        "/api/v1/users",
        json={
            "name": "Lakshmi",
            "age": 28,
            "gender": "female",
            "state": "Telangana",
            "locality_type": "rural",
            "is_shg_member": True,
            "monthly_income": 15000.0,
        },
    )
    user_id = user_res.json()["id"]

    chat_res = client.post(
        "/api/v1/ai/chat",
        json={
            "user_id": user_id,
            "message": "Which government schemes can I apply for?",
            "language": "en",
        },
    )
    assert chat_res.status_code == 200
    reply = chat_res.json()["reply"]
    assert "PMSBY" in reply or "PMJJBY" in reply or "Stree Nidhi" in reply


def test_ai_explain_concept(client: TestClient):
    """Test Universal Concept Explainer endpoint."""
    res = client.post(
        "/api/v1/ai/explain",
        json={
            "concept_slug": "suraksha-kavach-emergency-buffer",
            "language": "en",
        },
    )
    assert res.status_code == 200
    data = res.json()
    assert data["concept_slug"] == "suraksha-kavach-emergency-buffer"
    assert "Emergency Buffer" in data["title"]
    assert len(data["explanation"]) > 20
    assert "Golden Rule" in (data["golden_rule"] or "")



def test_ai_chat_general_cashflow_and_zero_debt(client: TestClient):
    """Test AI companion greeting and zero debt response."""
    user_res = client.post(
        "/api/v1/users",
        json={
            "name": "Kavitha",
            "age": 32,
            "gender": "female",
            "state": "Telangana",
            "monthly_income": 18000.0,
            "monthly_expenses": 10000.0,
            "initial_savings": 12000.0,
        },
    )
    user_id = user_res.json()["id"]

    # 1. General greeting
    chat_res = client.post(
        "/api/v1/ai/chat",
        json={"user_id": user_id, "message": "Hello Sakhi", "language": "en"},
    )
    assert chat_res.status_code == 200
    data = chat_res.json()
    assert "Kavitha" in data["reply"]
    assert "8,000" in data["reply"]  # 18000 - 10000

    # 2. Debt question with zero debts
    debt_res = client.post(
        "/api/v1/ai/chat",
        json={"user_id": user_id, "message": "How much debt do I have?", "language": "en"},
    )
    assert debt_res.status_code == 200
    reply_lower = debt_res.json()["reply"].lower()
    assert "zero" in reply_lower or "0" in reply_lower or "no debt" in reply_lower



def test_ai_chat_error_404(client: TestClient):
    """Test 404 responses for invalid user or invalid concept."""
    # Invalid user on chat
    chat_res = client.post(
        "/api/v1/ai/chat",
        json={"user_id": 999999, "message": "Hello"},
    )
    assert chat_res.status_code == 404

    # Invalid user on grounding
    g_res = client.get("/api/v1/ai/grounding/999999")
    assert g_res.status_code == 404

    # Invalid concept
    c_res = client.post(
        "/api/v1/ai/explain",
        json={"concept_slug": "non-existent-concept-xyz"},
    )
    assert c_res.status_code == 404

