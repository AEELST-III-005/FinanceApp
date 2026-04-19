from pydantic import BaseModel


class CategoryBase(BaseModel):
    name: str
    icon: str
    color: str


class CategoryCreate(CategoryBase):
    pass


class CategoryUpdate(CategoryBase):
    pass


class CategoryDTO(CategoryBase):
    id: str

    class Config:
        from_attributes = True
