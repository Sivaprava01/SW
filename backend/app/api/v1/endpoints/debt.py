"""
Sakhi Debt API Endpoints.

Handles recording liabilities, updating balances, listing debts,
and generating deterministic debt snowball & SHG refinancing analyses.
"""

from typing import List
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.errors import ResourceNotFoundException
from app.schemas.debt import DebtCreate, DebtUpdate, DebtResponse, DebtSnowballAnalysisResponse
from app.services.user_service import UserService
from app.services.debt_service import DebtService

router = APIRouter(tags=["Debt Management & Snowball Refinancing"])


@router.post(
    "/users/{user_id}/debts",
    response_model=DebtResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Record Debt Liability",
    description="Record a loan from a moneylender, SHG, bank, or relative."
)
def create_debt(
    user_id: int,
    debt_in: DebtCreate,
    db: Session = Depends(get_db)
) -> DebtResponse:
    """Record a new debt."""
    user = UserService.get_user_by_id(db=db, user_id=user_id)
    if not user:
        raise ResourceNotFoundException(message=f"User with ID {user_id} not found")
    return DebtService.create_debt(db=db, user_id=user_id, debt_in=debt_in)


@router.get(
    "/users/{user_id}/debts",
    response_model=List[DebtResponse],
    summary="List Debts",
    description="Retrieve all active and cleared debts for a user with calculated monthly interest drain."
)
def list_debts(
    user_id: int,
    db: Session = Depends(get_db)
) -> List[DebtResponse]:
    """List debts for a user."""
    user = UserService.get_user_by_id(db=db, user_id=user_id)
    if not user:
        raise ResourceNotFoundException(message=f"User with ID {user_id} not found")
    return DebtService.get_user_debts(db=db, user_id=user_id)


@router.get(
    "/users/{user_id}/debts/{debt_id}",
    response_model=DebtResponse,
    summary="Get Debt",
    description="Retrieve a single debt record."
)
def get_debt(
    user_id: int,
    debt_id: int,
    db: Session = Depends(get_db)
) -> DebtResponse:
    """Get debt by ID."""
    user = UserService.get_user_by_id(db=db, user_id=user_id)
    if not user:
        raise ResourceNotFoundException(message=f"User with ID {user_id} not found")
    debt = DebtService.get_debt_by_id(db=db, user_id=user_id, debt_id=debt_id)
    if not debt:
        raise ResourceNotFoundException(message=f"Debt with ID {debt_id} not found")
    return DebtService.format_debt_response(debt)


@router.patch(
    "/users/{user_id}/debts/{debt_id}",
    response_model=DebtResponse,
    summary="Update Debt",
    description="Update debt balance, interest rate, or mark loan as cleared."
)
def update_debt(
    user_id: int,
    debt_id: int,
    debt_in: DebtUpdate,
    db: Session = Depends(get_db)
) -> DebtResponse:
    """Update an existing debt record."""
    user = UserService.get_user_by_id(db=db, user_id=user_id)
    if not user:
        raise ResourceNotFoundException(message=f"User with ID {user_id} not found")
    
    updated_debt = DebtService.update_debt(db=db, user_id=user_id, debt_id=debt_id, debt_in=debt_in)
    if not updated_debt:
        raise ResourceNotFoundException(message=f"Debt with ID {debt_id} not found")
    return updated_debt


@router.delete(
    "/users/{user_id}/debts/{debt_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete Debt",
    description="Delete a debt record."
)
def delete_debt(
    user_id: int,
    debt_id: int,
    db: Session = Depends(get_db)
) -> None:
    """Delete a debt by ID."""
    user = UserService.get_user_by_id(db=db, user_id=user_id)
    if not user:
        raise ResourceNotFoundException(message=f"User with ID {user_id} not found")
    
    deleted = DebtService.delete_debt(db=db, user_id=user_id, debt_id=debt_id)
    if not deleted:
        raise ResourceNotFoundException(message=f"Debt with ID {debt_id} not found")


@router.get(
    "/users/{user_id}/debts-analysis/snowball",
    response_model=DebtSnowballAnalysisResponse,
    summary="Snowball & SHG Refinancing Analysis",
    description="Calculates total monthly interest drain, potential rupees saved by refinancing with an SHG, and recommended snowball & avalanche payoff schedules."
)
def get_snowball_analysis(
    user_id: int,
    db: Session = Depends(get_db)
) -> DebtSnowballAnalysisResponse:
    """Calculate deterministic debt payoff and refinancing analysis."""
    user = UserService.get_user_by_id(db=db, user_id=user_id)
    if not user:
        raise ResourceNotFoundException(message=f"User with ID {user_id} not found")
    return DebtService.calculate_snowball_analysis(db=db, user=user)
