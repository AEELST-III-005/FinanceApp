from dtos.category import CategoryCreate
from exceptions.business_exceptions import EntityNotFoundError
from repositories.category_repository import CategoryRepository


class CategoryService:
    def __init__(self, repository: CategoryRepository):
        self.repository = repository

    def get_all_categories(self):
        return self.repository.get_all()

    def create_category(self, category: CategoryCreate):
        return self.repository.create(category)

    def delete_category(self, category_id: str):
        success = self.repository.delete(category_id)
        if not success:
            raise EntityNotFoundError("Category not found")
        return True
