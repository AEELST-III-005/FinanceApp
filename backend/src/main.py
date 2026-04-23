from config.database import create_tables
from config.settings import settings  # noqa: F401
from controllers.category_controller import router as category_router
from controllers.dashboard_controller import router as dashboard_router
from controllers.transaction_controller import router as transaction_router
from exceptions.exception_handlers import register_exception_handlers
from fastapi import FastAPI

app = FastAPI()

create_tables()

register_exception_handlers(app)

app.include_router(category_router)
app.include_router(transaction_router)
app.include_router(dashboard_router)


@app.get("/")
def read_root():
    return {"FinanceApp": "Started"}
