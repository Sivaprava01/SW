"""
Health & Readiness Endpoints.

Provides Kubernetes/Render/cloud-compatible liveness and readiness probes.
"""

from datetime import datetime, timezone
from fastapi import APIRouter, Response, status
from app.core.config import settings
from app.core.database import check_db_connection
from app.schemas.health import HealthResponse, ReadinessResponse

router = APIRouter(tags=["Health & Diagnostics"])


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
