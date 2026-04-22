from config.database import Base
from sqlalchemy import Column, Date, ForeignKey, Numeric, String
from sqlalchemy.orm import relationship


class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(String, primary_key=True, index=True)
    title = Column(String, index=True, nullable=False)
    description = Column(String, nullable=True)
    amount = Column(Numeric(10, 2), nullable=False)
    transaction_date = Column(Date, nullable=False)
    transaction_type = Column(String, nullable=False)
    category_id = Column(String, ForeignKey("categories.id"), nullable=False)

    category = relationship("Category", back_populates="transactions")
