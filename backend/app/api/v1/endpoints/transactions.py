"""
Sakhi Transaction API Endpoints.

Handles logging income/expense entries, listing user transactions, and deletion.
"""

from typing import List, Optional
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.api.deps import get_optional_user, verify_user_access
from app.models.user import User
from app.core.errors import ResourceNotFoundException
from app.schemas.transaction import TransactionCreate, TransactionResponse
from app.services.user_service import UserService
from app.services.transaction_service import TransactionService

router = APIRouter(tags=["Transactions & Cashflow"])


@router.post(
    "/users/{user_id}/transactions",
    response_model=TransactionResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Log Transaction",
    description="Record an income or expense transaction for a user."
)
def create_transaction(
    user_id: int,
    transaction_in: TransactionCreate,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_user),
) -> TransactionResponse:
    """Log an income or expense entry for a user."""
    verify_user_access(user_id, current_user)
    user = UserService.get_user_by_id(db=db, user_id=user_id)
    if not user:
        raise ResourceNotFoundException(message=f"User with ID {user_id} not found")
    return TransactionService.create_transaction(db=db, user_id=user_id, transaction_in=transaction_in)


@router.get(
    "/users/{user_id}/transactions",
    response_model=List[TransactionResponse],
    summary="List Transactions",
    description="Retrieve a user's transaction history with optional type filtering."
)
def list_transactions(
    user_id: int,
    type: Optional[str] = Query(default=None, description="Filter by 'income' or 'expense'"),
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=50, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_user),
) -> List[TransactionResponse]:
    """List transactions for a user."""
    verify_user_access(user_id, current_user)
    user = UserService.get_user_by_id(db=db, user_id=user_id)
    if not user:
        raise ResourceNotFoundException(message=f"User with ID {user_id} not found")
    return TransactionService.get_user_transactions(db=db, user_id=user_id, type=type, skip=skip, limit=limit)


@router.delete(
    "/users/{user_id}/transactions/{transaction_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete Transaction",
    description="Delete a specific transaction record."
)
def delete_transaction(
    user_id: int,
    transaction_id: int,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_user),
) -> None:
    """Delete a user's transaction by ID."""
    verify_user_access(user_id, current_user)
    user = UserService.get_user_by_id(db=db, user_id=user_id)
    if not user:
        raise ResourceNotFoundException(message=f"User with ID {user_id} not found")
    
    deleted = TransactionService.delete_transaction(db=db, user_id=user_id, transaction_id=transaction_id)
    if not deleted:
        raise ResourceNotFoundException(message=f"Transaction with ID {transaction_id} not found")
