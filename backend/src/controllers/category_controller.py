from typing import List

from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from config.database import get_db
from dtos.category import CategoryCreate, CategoryDTO
from repositories.category_repository import CategoryRepository
from services.category_service import CategoryService

router = APIRouter(prefix="/api/categories", tags=["categories"])


def get_category_service(db: Session = Depends(get_db)) -> CategoryService:
    repository = CategoryRepository(db)
    return CategoryService(repository)


@router.get("/", response_model=List[CategoryDTO])
def get_categories(service: CategoryService = Depends(get_category_service)):
    return service.get_all_categories()


@router.post("/", response_model=CategoryDTO, status_code=status.HTTP_201_CREATED)
def create_category(
    category: CategoryCreate, service: CategoryService = Depends(get_category_service)
):
    return service.create_category(category)


@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_category(id: str, service: CategoryService = Depends(get_category_service)):
    service.delete_category(id)
    return None
