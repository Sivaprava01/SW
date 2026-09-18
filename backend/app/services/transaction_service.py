"""
Sakhi Transaction Service Module.

Handles database transactions, logging, fetching, and deletion of user cashflow entries.
"""

from typing import List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import select
from app.models.transaction import Transaction
from app.schemas.transaction import TransactionCreate
from app.core.logging import logger


class TransactionService:
    """Service handling user income and expense transactions."""

    @staticmethod
    def create_transaction(db: Session, user_id: int, transaction_in: TransactionCreate) -> Transaction:
        """Create and persist a new user transaction."""
        transaction = Transaction(
            user_id=user_id,
            amount=transaction_in.amount,
            type=transaction_in.type,
            category=transaction_in.category,
            date=transaction_in.date,
            description=transaction_in.description,
        )
        db.add(transaction)
        db.commit()
        db.refresh(transaction)
        logger.info(
            f"Created {transaction.type} transaction id={transaction.id} for user_id={user_id}: ₹{transaction.amount}"
        )
        return transaction

    @staticmethod
    def get_transaction_by_id(db: Session, user_id: int, transaction_id: int) -> Optional[Transaction]:
        """Fetch a specific transaction belonging to a user."""
        stmt = select(Transaction).where(Transaction.id == transaction_id, Transaction.user_id == user_id)
        return db.execute(stmt).scalar_one_or_none()

    @staticmethod
    def get_user_transactions(
        db: Session,
        user_id: int,
        type: Optional[str] = None,
        skip: int = 0,
        limit: int = 50,
    ) -> List[Transaction]:
        """Fetch transactions for a user with optional type filtering and pagination."""
        stmt = select(Transaction).where(Transaction.user_id == user_id)
        if type:
            stmt = stmt.where(Transaction.type == type)
        stmt = stmt.order_by(Transaction.date.desc(), Transaction.id.desc()).offset(skip).limit(limit)
        return list(db.execute(stmt).scalars().all())

    @staticmethod
    def delete_transaction(db: Session, user_id: int, transaction_id: int) -> bool:
        """Delete a transaction belonging to a user."""
        transaction = TransactionService.get_transaction_by_id(db, user_id, transaction_id)
        if not transaction:
            return False
        db.delete(transaction)
        db.commit()
        logger.info(f"Deleted transaction id={transaction_id} for user_id={user_id}")
        return True
