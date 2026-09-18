"""
Sakhi API v1 Root Router.

Aggregates all domain sub-routers under the /api/v1 prefix.
"""

from fastapi import APIRouter
from app.api.v1.endpoints import health

api_v1_router = APIRouter()

# Register core health router
api_v1_router.include_router(health.router)
