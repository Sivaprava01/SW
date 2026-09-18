"""
Health & Readiness Schemas.
"""

from datetime import datetime
from pydantic import BaseModel, Field


class HealthResponse(BaseModel):
    """Schema returned by the liveness check endpoint."""
    status: str = Field(default="ok", description="Overall service status")
    app: str = Field(..., description="Application name")
    version: str = Field(..., description="Application semantic version")
    environment: str = Field(..., description="Running environment")
    timestamp: datetime = Field(..., description="UTC timestamp of the check")


class ReadinessResponse(BaseModel):
    """Schema returned by the readiness check endpoint."""
    status: str = Field(..., description="Readiness status ('ready' or 'unready')")
    database: str = Field(..., description="Database connection health ('connected' or error)")
    app: str = Field(..., description="Application name")
    version: str = Field(..., description="Application semantic version")
    timestamp: datetime = Field(..., description="UTC timestamp of the check")
