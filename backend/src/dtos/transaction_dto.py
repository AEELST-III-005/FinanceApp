from datetime import date
from decimal import Decimal
from typing import Optional

from dtos.category import CategoryDTO
from pydantic import BaseModel, computed_field


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
    category: Optional[CategoryDTO] = None

    @computed_field
    @property
    def category_name(self) -> Optional[str]:
        return self.category.name if self.category else None

    class Config:
        from_attributes = True
        # We need to allow the category object to be populated from the model relationship
