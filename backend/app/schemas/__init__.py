"""
Sakhi Pydantic Schemas Package.
"""

from app.schemas.health import HealthResponse, ReadinessResponse
from app.schemas.common import ErrorDetail, ErrorResponse, RootResponse
from app.schemas.user import UserBase, UserCreate, UserUpdate, UserResponse, UserPreferencesUpdate
from app.schemas.transaction import TransactionBase, TransactionCreate, TransactionResponse
from app.schemas.finance import CategoryBreakdown, FinancialSummaryResponse
from app.schemas.goal import GoalBase, GoalCreate, GoalUpdate, GoalDepositRequest, GoalResponse
from app.schemas.debt import (
    DebtBase,
    DebtCreate,
    DebtUpdate,
    DebtResponse,
    DebtSnowballItem,
    DebtSnowballAnalysisResponse,
)

__all__ = [
    "HealthResponse",
    "ReadinessResponse",
    "ErrorDetail",
    "ErrorResponse",
    "RootResponse",
    "UserBase",
    "UserCreate",
    "UserUpdate",
    "UserResponse",
    "UserPreferencesUpdate",
    "TransactionBase",
    "TransactionCreate",
    "TransactionResponse",
    "CategoryBreakdown",
    "FinancialSummaryResponse",
    "GoalBase",
    "GoalCreate",
    "GoalUpdate",
    "GoalDepositRequest",
    "GoalResponse",
    "DebtBase",
    "DebtCreate",
    "DebtUpdate",
    "DebtResponse",
    "DebtSnowballItem",
    "DebtSnowballAnalysisResponse",
]
