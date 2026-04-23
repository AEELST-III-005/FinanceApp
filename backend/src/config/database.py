import os
from config.settings import settings
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Use SQLite in-memory as default for tests or when DATABASE_URL is not set
database_url = settings.DATABASE_URL or "sqlite:///./prod_default.db"

engine = create_engine(database_url)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


# Create tables if they don't exist (when not running tests)
def create_tables():
    if os.getenv("TESTING") != "True":
        from models.category import Category  # noqa: F401
        from models.transaction_model import Transaction  # noqa: F401
        try:
            Base.metadata.create_all(bind=engine)
        except Exception as e:
            print(f"Error creating tables: {e}")


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
