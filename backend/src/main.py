import os

from config.database import Base, engine
from controllers.category_controller import router as category_router
from controllers.transaction_controller import router as transaction_router
from exceptions.exception_handlers import register_exception_handlers
from fastapi import FastAPI

app = FastAPI()

# Create tables if they don't exist (when not running tests)
if os.getenv("TESTING") != "True":
    try:
        Base.metadata.create_all(bind=engine)
    except Exception as e:
        print(f"Error creating tables: {e}")

register_exception_handlers(app)

app.include_router(category_router)
app.include_router(transaction_router)


@app.get("/")
def read_root():
    return {"FinanceApp": "Started"}
