import uuid
from datetime import date
from decimal import Decimal
from typing import List, Optional, Tuple

from dtos.transaction_dto import TransactionCreate
from models.category import Category
from models.transaction_model import Transaction
from sqlalchemy import case, extract, func
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

    def get_total_by_type(self, transaction_type: str) -> Decimal:
        return self.db.query(func.sum(Transaction.amount)).filter(
            Transaction.transaction_type == transaction_type
        ).scalar() or Decimal("0")

    def get_period_expenses(self, start_date: date, end_date: date) -> Decimal:
        return self.db.query(func.sum(Transaction.amount)).filter(
            Transaction.transaction_type == "expense",
            Transaction.transaction_date >= start_date,
            Transaction.transaction_date <= end_date,
        ).scalar() or Decimal("0")

    def get_monthly_history(
        self, start_date: date
    ) -> List[Tuple[int, int, Decimal, Decimal]]:
        return (
            self.db.query(
                extract("year", Transaction.transaction_date).label("year"),
                extract("month", Transaction.transaction_date).label("month"),
                func.sum(
                    case(
                        (Transaction.transaction_type == "income", Transaction.amount),
                        else_=0,
                    )
                ).label("incomes"),
                func.sum(
                    case(
                        (Transaction.transaction_type == "expense", Transaction.amount),
                        else_=0,
                    )
                ).label("expenses"),
            )
            .filter(Transaction.transaction_date >= start_date)
            .group_by(
                extract("year", Transaction.transaction_date),
                extract("month", Transaction.transaction_date),
            )
            .all()
        )

    def get_expenses_by_category(
        self, start_date: date, end_date: date
    ) -> List[Tuple[str, str, str, Decimal]]:
        return (
            self.db.query(
                Category.name,
                Category.color,
                Category.icon,
                func.sum(Transaction.amount).label("total_amount"),
            )
            .join(Transaction, Transaction.category_id == Category.id)
            .filter(
                Transaction.transaction_type == "expense",
                Transaction.transaction_date >= start_date,
                Transaction.transaction_date <= end_date,
            )
            .group_by(Category.id)
            .order_by(func.sum(Transaction.amount).desc())
            .all()
        )

    def get_recent_transactions(self, limit: int = 10) -> List[Transaction]:
        return (
            self.db.query(Transaction)
            .options(joinedload(Transaction.category))
            .order_by(Transaction.transaction_date.desc(), Transaction.id.desc())
            .limit(limit)
            .all()
        )
