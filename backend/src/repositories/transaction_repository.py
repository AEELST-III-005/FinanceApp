import uuid
from datetime import date
from typing import List, Optional

from dtos.transaction_dto import TransactionCreate
from models.transaction_model import Transaction
from sqlalchemy.orm import Session, joinedload


class TransactionRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_transactions(
        self,
        start_date: Optional[date] = None,
        end_date: Optional[date] = None,
        category_id: Optional[str] = None,
        transaction_type: Optional[str] = None,
    ) -> List[Transaction]:
        query = self.db.query(Transaction).options(joinedload(Transaction.category))

        if start_date:
            query = query.filter(Transaction.transaction_date >= start_date)
        if end_date:
            query = query.filter(Transaction.transaction_date <= end_date)
        if category_id:
            query = query.filter(Transaction.category_id == category_id)
        if transaction_type:
            query = query.filter(Transaction.transaction_type == transaction_type)

        return query.all()

    def get_by_id(self, transaction_id: str) -> Optional[Transaction]:
        return (
            self.db.query(Transaction)
            .options(joinedload(Transaction.category))
            .filter(Transaction.id == transaction_id)
            .first()
        )

    def create(self, transaction_data: TransactionCreate) -> Transaction:
        db_transaction = Transaction(
            id=str(uuid.uuid4()),
            title=transaction_data.title,
            description=transaction_data.description,
            amount=transaction_data.amount,
            transaction_date=transaction_data.transaction_date,
            transaction_type=transaction_data.transaction_type,
            category_id=transaction_data.category_id,
        )
        self.db.add(db_transaction)
        self.db.commit()
        self.db.refresh(db_transaction)
        return db_transaction

    def update(
        self, transaction_id: str, transaction_data: TransactionCreate
    ) -> Optional[Transaction]:
        db_transaction = self.get_by_id(transaction_id)
        if not db_transaction:
            return None

        db_transaction.title = transaction_data.title
        db_transaction.description = transaction_data.description
        db_transaction.amount = transaction_data.amount
        db_transaction.transaction_date = transaction_data.transaction_date
        db_transaction.transaction_type = transaction_data.transaction_type
        db_transaction.category_id = transaction_data.category_id

        self.db.commit()
        self.db.refresh(db_transaction)
        return db_transaction

    def delete(self, transaction_id: str) -> bool:
        db_transaction = self.get_by_id(transaction_id)
        if not db_transaction:
            return False

        self.db.delete(db_transaction)
        self.db.commit()
        return True
