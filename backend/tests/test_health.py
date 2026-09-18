"""
Unit & Integration Tests for Health, Readiness, Root, and Error Envelopes.
"""

from fastapi.testclient import TestClient


def test_root_endpoint(client: TestClient):
    """Test the root metadata endpoint GET /."""
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["app"] == "Sakhi"
    assert "version" in data
    assert "api_v1" in data
    assert data["health"] == "/api/v1/health"


def test_health_liveness_endpoint(client: TestClient):
    """Test the liveness health endpoint GET /api/v1/health."""
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert data["app"] == "Sakhi"
    assert "version" in data
    assert "environment" in data
    assert "timestamp" in data


def test_health_readiness_endpoint(client: TestClient):
    """Test the readiness health endpoint GET /api/v1/health/ready."""
    response = client.get("/api/v1/health/ready")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ready"
    assert data["database"] == "connected"
    assert data["app"] == "Sakhi"
    assert "timestamp" in data


def test_404_standard_error_envelope(client: TestClient):
    """Test that a non-existent route returns standard error envelope with 404."""
    response = client.get("/api/v1/non-existent-route")
    assert response.status_code == 404
    data = response.json()
    assert data["status"] == "error"
    assert "error" in data
    assert data["error"]["code"] == "NOT_FOUND"
    assert "message" in data["error"]
