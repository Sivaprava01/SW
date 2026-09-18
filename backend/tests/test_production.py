"""
Sakhi Production Hardening, Security, Middleware & Health Probe Tests.

Validates security response headers, distributed request tracing (X-Request-ID),
latency profiling (X-Process-Time), rate limiting, JSON structured logging, and metrics probes.
"""

import json
import logging
from fastapi.testclient import TestClient
from app.core.logging import JSONFormatter
from app.core.config import settings


def test_security_headers_middleware(client: TestClient):
    """Verify that essential security headers are injected into all HTTP responses."""
    response = client.get("/")
    assert response.status_code == 200
    headers = response.headers

    assert headers.get("X-Content-Type-Options") == "nosniff"
    assert headers.get("X-Frame-Options") == "DENY"
    assert headers.get("X-XSS-Protection") == "1; mode=block"
    assert headers.get("Referrer-Policy") == "strict-origin-when-cross-origin"
    assert "microphone=" in headers.get("Permissions-Policy", "")


def test_request_tracing_middleware(client: TestClient):
    """Verify automatic X-Request-ID generation and latency timing headers."""
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    assert "X-Request-ID" in response.headers
    assert len(response.headers["X-Request-ID"]) > 10
    assert "X-Process-Time" in response.headers
    assert response.headers["X-Process-Time"].endswith("ms")


def test_custom_request_id_propagation(client: TestClient):
    """Verify that client-provided trace IDs are preserved throughout request lifecycle."""
    custom_id = "trace-client-12345-abcde"
    response = client.get("/api/v1/health", headers={"X-Request-ID": custom_id})
    assert response.status_code == 200
    assert response.headers["X-Request-ID"] == custom_id


def test_metrics_diagnostic_endpoint(client: TestClient):
    """Verify /health/metrics returns system health, uptime, and engine configurations."""
    response = client.get("/api/v1/health/metrics")
    assert response.status_code == 200
    data = response.json()

    assert data["app"] == "Sakhi"
    assert data["version"] == "1.0.0"
    assert data["uptime_seconds"] >= 0.0
    assert data["database_status"] == "connected"
    assert "ai_provider" in data
    assert "voice_tts_provider" in data
    assert "timestamp" in data


def test_readiness_probe_healthy(client: TestClient):
    """Verify /health/ready returns 200 OK when database is operational."""
    response = client.get("/api/v1/health/ready")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ready"
    assert data["database"] == "connected"


def test_rate_limiter_protection(client: TestClient, monkeypatch):
    """Verify rate limiter blocks abusive traffic and returns 429 with Retry-After header."""
    # Temporarily set rate limit to 3 requests/min for testing
    monkeypatch.setattr(settings, "RATE_LIMIT_PER_MINUTE", 3)
    monkeypatch.setattr(settings, "RATE_LIMIT_ENABLED", True)

    client_headers = {"X-Forwarded-For": "203.0.113.195"}

    # Request 1, 2, 3 should succeed
    for _ in range(3):
        res = client.get("/api/v1/users", headers=client_headers)
        assert res.status_code in [200, 404]

    # Request 4 should be throttled (429)
    res_throttled = client.get("/api/v1/users", headers=client_headers)
    assert res_throttled.status_code == 429
    assert res_throttled.headers.get("Retry-After") == "60"
    data = res_throttled.json()
    assert data["error"]["code"] == "RATE_LIMIT_EXCEEDED"


def test_json_logger_formatter():
    """Verify JSONFormatter outputs valid structured JSON log records for production aggregators."""
    formatter = JSONFormatter()
    record = logging.LogRecord(
        name="sakhi.test",
        level=logging.INFO,
        pathname="test_production.py",
        lineno=88,
        msg="Transaction recorded successfully",
        args=(),
        exc_info=None,
    )
    formatted = formatter.format(record)
    parsed = json.loads(formatted)

    assert parsed["level"] == "INFO"
    assert parsed["logger"] == "sakhi.test"
    assert parsed["message"] == "Transaction recorded successfully"
    assert "timestamp" in parsed
    assert "environment" in parsed
