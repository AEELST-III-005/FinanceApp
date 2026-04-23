import logging

from config.database import get_db
from dtos.dashboard_dto import DashboardPeriod, DashboardResponse
from fastapi import APIRouter, Depends, Query, status
from repositories.category_repository import CategoryRepository
from repositories.transaction_repository import TransactionRepository
from services.dashboard_service import DashboardService
from sqlalchemy.orm import Session

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/dashboard", tags=["Dashboard"])


def get_dashboard_service(db: Session = Depends(get_db)) -> DashboardService:
    transaction_repo = TransactionRepository(db)
    category_repo = CategoryRepository(db)
    return DashboardService(transaction_repo, category_repo)


@router.get("/", response_model=DashboardResponse, status_code=status.HTTP_200_OK)
def get_dashboard_data(
    period: DashboardPeriod = Query(DashboardPeriod.CURRENT_MONTH),
    service: DashboardService = Depends(get_dashboard_service),
):
    logger.info(
        "period: DashboardPeriod = Query(DashboardPeriod.CURRENT_MONTH), "
        f"value={period}"
    )
    return service.get_dashboard_summary(period)
