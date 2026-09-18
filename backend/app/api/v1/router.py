"""
Sakhi API v1 Root Router.

Aggregates all domain sub-routers under the /api/v1 prefix.
"""

from fastapi import APIRouter
from app.api.v1.endpoints import health, users

api_v1_router = APIRouter()

# Register routers
api_v1_router.include_router(health.router)
api_v1_router.include_router(users.router)
