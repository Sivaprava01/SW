"""
Sakhi API v1 Root Router.

Aggregates all domain sub-routers under the /api/v1 prefix.
"""

from fastapi import APIRouter
from app.api.v1.endpoints import (
    health,
    auth,
    users,
    transactions,
    financial_health,
    goals,
    debt,
    calculators,
    knowledge,
    learning,
    journey,
    schemes,
    ai,
    voice,
)

api_v1_router = APIRouter()

# Register routers
api_v1_router.include_router(health.router)
api_v1_router.include_router(auth.router)
api_v1_router.include_router(users.router)
api_v1_router.include_router(transactions.router)
api_v1_router.include_router(financial_health.router)
api_v1_router.include_router(goals.router)
api_v1_router.include_router(debt.router)
api_v1_router.include_router(calculators.router)
api_v1_router.include_router(knowledge.router)
api_v1_router.include_router(learning.router)
api_v1_router.include_router(journey.router)
api_v1_router.include_router(schemes.router)
api_v1_router.include_router(ai.router)
api_v1_router.include_router(voice.router, prefix="/voice", tags=["Voice & Speech"])


