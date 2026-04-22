from datetime import date
from typing import List, Optional
from dtos.transaction_dto import TransactionCreate
from exceptions.business_exceptions import EntityNotFoundError
from repositories.transaction_repository import TransactionRepository


class TransactionService:
    def __init__(self, repository: TransactionRepository):
        self.repository = repository

    def get_transactions(
        self,
        start_date: Optional[date] = None,
        end_date: Optional[date] = None,
        category_id: Optional[str] = None,
        transaction_type: Optional[str] = None
    ) -> List:
        return self.repository.get_transactions(start_date, end_date, category_id, transaction_type)

    def create_transaction(self, transaction_data: TransactionCreate):
        return self.repository.create(transaction_data)

    def update_transaction(self, transaction_id: str, transaction_data: TransactionCreate):
        db_transaction = self.repository.update(transaction_id, transaction_data)
        if not db_transaction:
            raise EntityNotFoundError(f"Transaction with id {transaction_id} not found")
        return db_transaction

    def delete_transaction(self, transaction_id: str):
        success = self.repository.delete(transaction_id)
        if not success:
            raise EntityNotFoundError(f"Transaction with id {transaction_id} not found")
        return True
