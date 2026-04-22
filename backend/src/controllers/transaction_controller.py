from datetime import date
from typing import List, Optional

from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session

from config.database import get_db
from dtos.transaction_dto import TransactionCreate, TransactionDTO
from repositories.transaction_repository import TransactionRepository
from services.transaction_service import TransactionService

router = APIRouter(prefix="/api/transactions", tags=["transactions"])


def get_transaction_service(db: Session = Depends(get_db)) -> TransactionService:
    repository = TransactionRepository(db)
    return TransactionService(repository)


@router.get("/", response_model=List[TransactionDTO])
def get_transactions(
    start_date: Optional[date] = Query(None),
    end_date: Optional[date] = Query(None),
    category_id: Optional[str] = Query(None),
    transaction_type: Optional[str] = Query(None),
    service: TransactionService = Depends(get_transaction_service),
):
    return service.get_transactions(start_date, end_date, category_id, transaction_type)


@router.post("/", response_model=TransactionDTO, status_code=status.HTTP_201_CREATED)
def create_transaction(
    transaction: TransactionCreate,
    service: TransactionService = Depends(get_transaction_service),
):
    return service.create_transaction(transaction)


@router.put("/{id}", response_model=TransactionDTO)
def update_transaction(
    id: str,
    transaction: TransactionCreate,
    service: TransactionService = Depends(get_transaction_service),
):
    return service.update_transaction(id, transaction)


@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_transaction(
    id: str, service: TransactionService = Depends(get_transaction_service)
):
    service.delete_transaction(id)
    return None
