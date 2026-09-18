"""
Unit & Integration Tests for Sakhi B5 Financial Knowledge & Golden Rules.
"""

from fastapi.testclient import TestClient


def test_list_financial_concepts(client: TestClient):
    """Test retrieving all verified financial concepts with multilingual translations."""
    response = client.get("/api/v1/knowledge/concepts")
    assert response.status_code == 200
    data = response.json()

    assert len(data) >= 5
    first = data[0]
    assert "title" in first
    assert "en" in first["title"]
    assert "te" in first["title"]
    assert "hi" in first["title"]
    assert "plain_language_explanation" in first


def test_filter_concepts_by_category(client: TestClient):
    """Test filtering concepts by category."""
    response = client.get("/api/v1/knowledge/concepts?category=Safety%20%26%20Emergency")
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 1
    assert data[0]["category"] == "Safety & Emergency"


def test_get_concept_by_slug(client: TestClient):
    """Test fetching a single concept by slug."""
    response = client.get("/api/v1/knowledge/concepts/suraksha-kavach-emergency-buffer")
    assert response.status_code == 200
    data = response.json()
    assert data["slug"] == "suraksha-kavach-emergency-buffer"
    assert "te" in data["title"]
    assert "సురక్ష కవచ్" in data["title"]["te"]


def test_get_concept_not_found(client: TestClient):
    """Test 404 on invalid concept slug."""
    response = client.get("/api/v1/knowledge/concepts/non-existent-concept-xyz")
    assert response.status_code == 404
    assert response.json()["status"] == "error"


def test_get_golden_rules(client: TestClient):
    """Test retrieving the 5 Golden Rules of Sakhi."""
    response = client.get("/api/v1/knowledge/golden-rules")
    assert response.status_code == 200
    data = response.json()

    assert len(data) == 5
    rules = {r["rule_number"]: r for r in data}
    assert 1 in rules
    assert 2 in rules
    assert 3 in rules
    assert 4 in rules
    assert 5 in rules
    assert rules[1]["rule_key"] == "emergency_shield_first"
    assert "en" in rules[1]["title"]
    assert "te" in rules[1]["title"]
    assert "hi" in rules[1]["title"]
