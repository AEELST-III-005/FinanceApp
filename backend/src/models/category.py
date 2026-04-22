from config.database import Base
from sqlalchemy import Column, String
from sqlalchemy.orm import relationship


class Category(Base):
    __tablename__ = "categories"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    icon = Column(String)
    color = Column(String)

    transactions = relationship("Transaction", back_populates="category")
