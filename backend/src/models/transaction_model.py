from sqlalchemy import Column, String, Numeric, Date, ForeignKey
from sqlalchemy.orm import relationship
from config.database import Base

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
