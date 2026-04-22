from datetime import date
from decimal import Decimal
from typing import Optional

from pydantic import BaseModel


class TransactionBase(BaseModel):
    title: str
    description: Optional[str] = None
    amount: Decimal
    transaction_date: date
    transaction_type: str
    category_id: str


class TransactionCreate(TransactionBase):
    pass


class TransactionDTO(TransactionBase):
    id: str

    class Config:
        from_attributes = True
