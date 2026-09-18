"""
Sakhi API v1 Root Router.

Aggregates all domain sub-routers under the /api/v1 prefix.
"""

from fastapi import APIRouter
from app.api.v1.endpoints import (
    health,
    users,
    transactions,
    financial_health,
    goals,
    debt,
    calculators,
    knowledge,
)

api_v1_router = APIRouter()

# Register routers
api_v1_router.include_router(health.router)
api_v1_router.include_router(users.router)
api_v1_router.include_router(transactions.router)
api_v1_router.include_router(financial_health.router)
api_v1_router.include_router(goals.router)
api_v1_router.include_router(debt.router)
api_v1_router.include_router(calculators.router)
api_v1_router.include_router(knowledge.router)
