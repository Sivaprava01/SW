from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.transaction import Transaction
from app.models.user import User
from app.schemas.transaction import TransactionCreate, TransactionResponse

router = APIRouter(prefix="/api/transactions", tags=["Transactions"])

@router.post("", response_model=TransactionResponse)
def create_transaction(tx_in: TransactionCreate, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == tx_in.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    tx = Transaction(
        user_id=tx_in.user_id,
        amount=tx_in.amount,
        type=tx_in.type,
        category=tx_in.category,
        date=tx_in.date,
        description=tx_in.description
    )
    db.add(tx)
    db.commit()
    db.refresh(tx)
    return tx

@router.get("/{user_id}", response_model=List[TransactionResponse])
def get_user_transactions(user_id: str, db: Session = Depends(get_db)):
    txs = db.query(Transaction).filter(Transaction.user_id == user_id).order_by(Transaction.created_at.desc()).all()
    return txs

@router.delete("/{transaction_id}")
def delete_transaction(transaction_id: str, db: Session = Depends(get_db)):
    tx = db.query(Transaction).filter(Transaction.id == transaction_id).first()
    if not tx:
        raise HTTPException(status_code=404, detail="Transaction not found")

    db.delete(tx)
    db.commit()
    return {"message": "Transaction deleted successfully"}
