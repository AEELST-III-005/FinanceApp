from datetime import date
from decimal import Decimal

from dtos.dashboard_dto import (
    CategorySummary,
    DashboardPeriod,
    DashboardResponse,
    DashboardSummary,
    MonthlyHistory,
    RecentTransaction,
)


class DashboardService:
    def __init__(self, transaction_repository=None, category_repository=None):
        # Repositories are not used yet as this is a stub
        self.transaction_repository = transaction_repository
        self.category_repository = category_repository

    def get_dashboard_summary(
        self, period: DashboardPeriod = DashboardPeriod.CURRENT_MONTH
    ) -> DashboardResponse:
        """
        Returns a stubbed DashboardResponse object.
        """
        summary = DashboardSummary(
            total_incomes=Decimal("3000.00"),
            total_expenses=Decimal("1536.32"),
            current_balance=Decimal("1463.68"),
            period_expenses=Decimal("1536.32"),
        )

        monthly_history = [
            MonthlyHistory(
                month="Jan", incomes=Decimal("2500.00"), expenses=Decimal("1200.00")
            ),
            MonthlyHistory(
                month="Feb", incomes=Decimal("2800.00"), expenses=Decimal("1400.00")
            ),
            MonthlyHistory(
                month="Mar", incomes=Decimal("3000.00"), expenses=Decimal("1536.32")
            ),
        ]

        expenses_by_category = [
            CategorySummary(
                category_name="Food",
                total_amount=Decimal("500.00"),
                color="#FF5733",
                icon="fast-food",
            ),
            CategorySummary(
                category_name="Rent",
                total_amount=Decimal("800.00"),
                color="#33FF57",
                icon="home",
            ),
            CategorySummary(
                category_name="Leisure",
                total_amount=Decimal("236.32"),
                color="#3357FF",
                icon="gamepad",
            ),
        ]

        recent_transactions = [
            RecentTransaction(
                id="1",
                title="Supermarket",
                amount=Decimal("50.00"),
                transaction_date=date(2026, 4, 20),
                transaction_type="expense",
                category_name="Food",
                category_color="#FF5733",
                category_icon="fast-food",
            ),
            RecentTransaction(
                id="2",
                title="Salary",
                amount=Decimal("3000.00"),
                transaction_date=date(2026, 4, 1),
                transaction_type="income",
                category_name="Salary",
                category_color="#FFD700",
                category_icon="cash",
            ),
        ]

        return DashboardResponse(
            summary=summary,
            monthly_history=monthly_history,
            expenses_by_category=expenses_by_category,
            recent_transactions=recent_transactions,
        )
