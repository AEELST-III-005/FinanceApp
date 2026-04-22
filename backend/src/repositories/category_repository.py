import uuid

from dtos.category import CategoryCreate
from exceptions.business_exceptions import EntityAlreadyExistsError
from models.category import Category as CategoryModel
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session


class CategoryRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_all(self):
        return self.db.query(CategoryModel).all()

    def create(self, category: CategoryCreate):
        # Check if category with same name already exists
        existing_category = (
            self.db.query(CategoryModel)
            .filter(CategoryModel.name == category.name)
            .first()
        )
        if existing_category:
            raise EntityAlreadyExistsError("Category with this name already exists")

        db_category = CategoryModel(
            id=str(uuid.uuid4()),
            name=category.name,
            icon=category.icon,
            color=category.color,
        )
        try:
            self.db.add(db_category)
            self.db.commit()
            self.db.refresh(db_category)
            return db_category
        except IntegrityError:
            self.db.rollback()
            raise EntityAlreadyExistsError("Category with this name already exists")

    def delete(self, category_id: str):
        db_category = (
            self.db.query(CategoryModel).filter(CategoryModel.id == category_id).first()
        )
        if db_category:
            self.db.delete(db_category)
            self.db.commit()
            return True
        return False
