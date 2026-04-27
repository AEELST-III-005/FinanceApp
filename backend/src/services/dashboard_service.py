from datetime import date
from decimal import Decimal
from typing import List

from dtos.dashboard_dto import (
    CategorySummary,
    DashboardPeriod,
    DashboardResponse,
    DashboardSummary,
    MonthlyHistory,
    RecentTransaction,
)
from utils.date_helper import DateHelper


class DashboardService:
    def __init__(self, transaction_repository=None, category_repository=None):
        self.transaction_repository = transaction_repository
        self.category_repository = category_repository

    def get_dashboard_summary(
        self, period: DashboardPeriod = DashboardPeriod.CURRENT_MONTH
    ) -> DashboardResponse:
        today = date.today()
        start_date, end_date = DateHelper.get_period_dates(period, today)

        summary = self._get_summary(start_date, end_date)
        monthly_history = self._get_monthly_history(today)
        expenses_by_category = self._get_expenses_by_category(start_date, end_date)
        recent_transactions = self._get_recent_transactions()

        return DashboardResponse(
            summary=summary,
            monthly_history=monthly_history,
            expenses_by_category=expenses_by_category,
            recent_transactions=recent_transactions,
        )

    def _get_summary(self, start_date: date, end_date: date) -> DashboardSummary:
        total_incomes = self.transaction_repository.get_total_by_type("income")
        total_expenses = self.transaction_repository.get_total_by_type("expense")
        period_expenses = self.transaction_repository.get_period_expenses(
            start_date, end_date
        )

        return DashboardSummary(
            total_incomes=total_incomes,
            total_expenses=total_expenses,
            current_balance=total_incomes - total_expenses,
            period_expenses=period_expenses,
        )

    def _get_monthly_history(self, reference_date: date) -> List[MonthlyHistory]:
        last_6_months_list = DateHelper.get_last_n_months(reference_date, 6)
        y_6, m_6 = last_6_months_list[0]
        start_6_months = date(y_6, m_6, 1)

        monthly_stats = self.transaction_repository.get_monthly_history(start_6_months)
        stats_map = {(int(s.year), int(s.month)): s for s in monthly_stats}

        monthly_history = []
        for y, m in last_6_months_list:
            month_str = f"{m:02d}/{y}"
            stat = stats_map.get((y, m))

            monthly_history.append(
                MonthlyHistory(
                    month=month_str,
                    incomes=Decimal(str(stat.incomes or 0)) if stat else Decimal("0"),
                    expenses=Decimal(str(stat.expenses or 0)) if stat else Decimal("0"),
                )
            )
        return monthly_history

    def _get_expenses_by_category(
        self, start_date: date, end_date: date
    ) -> List[CategorySummary]:
        category_stats = self.transaction_repository.get_expenses_by_category(
            start_date, end_date
        )
        return [
            CategorySummary(
                category_name=name,
                total_amount=Decimal(str(total or 0)),
                color=color,
                icon=icon,
            )
            for name, color, icon, total in category_stats
        ]

    def _get_recent_transactions(self, limit: int = 10) -> List[RecentTransaction]:
        recent_txs_db = self.transaction_repository.get_recent_transactions(limit)
        return [
            RecentTransaction(
                id=tx.id,
                title=tx.title,
                amount=Decimal(str(tx.amount)),
                transaction_date=tx.transaction_date,
                transaction_type=tx.transaction_type,
                category_name=tx.category.name if tx.category else "Unknown",
                category_color=tx.category.color if tx.category else None,
                category_icon=tx.category.icon if tx.category else None,
            )
            for tx in recent_txs_db
        ]
