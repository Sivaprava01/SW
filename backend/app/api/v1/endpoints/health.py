"""
Health, Readiness & Metrics Endpoints.

Provides Kubernetes/Render/cloud-compatible liveness, readiness, and diagnostic metric probes.
"""

import time
from datetime import datetime, timezone
from fastapi import APIRouter, Response, status
from app.core.config import settings
from app.core.database import check_db_connection
from app.schemas.health import HealthResponse, ReadinessResponse, MetricsResponse

router = APIRouter(tags=["Health & Diagnostics"])

START_TIME = time.time()


@router.get(
    "/health",
    response_model=HealthResponse,
    summary="Liveness Probe",
    description="Returns 200 OK if the application server is running and responding."
)
async def liveness() -> HealthResponse:
    """Check if application process is live."""
    return HealthResponse(
        status="ok",
        app=settings.PROJECT_NAME,
        version=settings.VERSION,
        environment=settings.ENVIRONMENT,
        timestamp=datetime.now(timezone.utc),
    )


@router.get(
    "/health/ready",
    response_model=ReadinessResponse,
    summary="Readiness Probe",
    description="Returns 200 OK if the application and all required backing services (database) are ready to serve traffic."
)
async def readiness(response: Response) -> ReadinessResponse:
    """Check if application and backing database are ready."""
    db_ok, db_msg = check_db_connection()
    current_time = datetime.now(timezone.utc)
    
    if not db_ok:
        response.status_code = status.HTTP_503_SERVICE_UNAVAILABLE
        return ReadinessResponse(
            status="unready",
            database=f"error: {db_msg}",
            app=settings.PROJECT_NAME,
            version=settings.VERSION,
            timestamp=current_time,
        )

    return ReadinessResponse(
        status="ready",
        database="connected",
        app=settings.PROJECT_NAME,
        version=settings.VERSION,
        timestamp=current_time,
    )


@router.get(
    "/health/metrics",
    response_model=MetricsResponse,
    summary="System Diagnostics & Metrics",
    description="Returns application uptime, database health, active AI engine, and environment metrics.",
)
async def metrics() -> MetricsResponse:
    """Retrieve runtime diagnostics and operational metrics."""
    db_ok, db_msg = check_db_connection()
    uptime = time.time() - START_TIME
    
    return MetricsResponse(
        app=settings.PROJECT_NAME,
        version=settings.VERSION,
        environment=settings.ENVIRONMENT,
        uptime_seconds=round(uptime, 2),
        database_status="connected" if db_ok else f"error: {db_msg}",
        ai_provider="Google Gemini (Live)" if (settings.GEMINI_API_KEY and len(settings.GEMINI_API_KEY) > 5) else "Deterministic Grounded Engine",
        voice_tts_provider=settings.VOICE_TTS_PROVIDER,
        timestamp=datetime.now(timezone.utc),
    )
