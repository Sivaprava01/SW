"""
Common Schemas and API Envelope Models.
"""

from typing import Any, Optional
from pydantic import BaseModel, Field


class ErrorDetail(BaseModel):
    """Detailed error object in error responses."""
    code: str = Field(..., description="Error code identifier")
    message: str = Field(..., description="Human-readable error description")
    details: Optional[Any] = Field(default=None, description="Optional granular validation or context details")


class ErrorResponse(BaseModel):
    """Standardized error envelope."""
    status: str = Field(default="error", description="Status string")
    error: ErrorDetail = Field(..., description="Error detail object")


class RootResponse(BaseModel):
    """Schema returned by the root endpoint."""
    app: str
    version: str
    description: str
    docs_url: str
    api_v1: str
    health: str
