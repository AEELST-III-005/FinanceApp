import calendar
from datetime import date, timedelta
from decimal import Decimal

from sqlalchemy import extract, func, case
from sqlalchemy.orm import Session, joinedload

from dtos.dashboard_dto import (
    CategorySummary,
    DashboardPeriod,
    DashboardResponse,
    DashboardSummary,
    MonthlyHistory,
    RecentTransaction,
)
from models.transaction_model import Transaction
from models.category import Category


class DashboardService:
    def __init__(self, transaction_repository=None, category_repository=None):
        self.transaction_repository = transaction_repository
        self.category_repository = category_repository

    def get_dashboard_summary(
        self, period: DashboardPeriod = DashboardPeriod.CURRENT_MONTH
    ) -> DashboardResponse:
        db: Session = self.transaction_repository.db

        # Determine period dates
        today = date.today()
        if period == DashboardPeriod.CURRENT_MONTH:
            start_date = today.replace(day=1)
            end_date = today.replace(day=calendar.monthrange(today.year, today.month)[1])
        elif period == DashboardPeriod.LAST_MONTH:
            first_day_this_month = today.replace(day=1)
            last_month_end = first_day_this_month - timedelta(days=1)
            start_date = last_month_end.replace(day=1)
            end_date = last_month_end
        elif period == DashboardPeriod.LAST_6_MONTHS:
            month = today.month - 5
            year = today.year
            if month <= 0:
                month += 12
                year -= 1
            start_date = date(year, month, 1)
            end_date = today.replace(day=calendar.monthrange(today.year, today.month)[1])
        elif period == DashboardPeriod.CURRENT_YEAR:
            start_date = today.replace(month=1, day=1)
            end_date = today.replace(month=12, day=31)
        else:
            start_date = today.replace(day=1)
            end_date = today.replace(day=calendar.monthrange(today.year, today.month)[1])

        # 1. Summary
        total_incomes = db.query(func.sum(Transaction.amount)).filter(Transaction.transaction_type == 'income').scalar() or Decimal('0')
        total_expenses = db.query(func.sum(Transaction.amount)).filter(Transaction.transaction_type == 'expense').scalar() or Decimal('0')
        current_balance = Decimal(str(total_incomes)) - Decimal(str(total_expenses))

        period_expenses = db.query(func.sum(Transaction.amount)).filter(
            Transaction.transaction_type == 'expense',
            Transaction.transaction_date >= start_date,
            Transaction.transaction_date <= end_date
        ).scalar() or Decimal('0')

        summary = DashboardSummary(
            total_incomes=Decimal(str(total_incomes)),
            total_expenses=Decimal(str(total_expenses)),
            current_balance=Decimal(str(current_balance)),
            period_expenses=Decimal(str(period_expenses)),
        )

        # 2. Monthly History (Last 6 months)
        month_6_ago = today.month - 5
        year_6_ago = today.year
        if month_6_ago <= 0:
            month_6_ago += 12
            year_6_ago -= 1
        start_6_months = date(year_6_ago, month_6_ago, 1)

        monthly_stats = db.query(
            extract('year', Transaction.transaction_date).label('year'),
            extract('month', Transaction.transaction_date).label('month'),
            func.sum(case((Transaction.transaction_type == 'income', Transaction.amount), else_=0)).label('incomes'),
            func.sum(case((Transaction.transaction_type == 'expense', Transaction.amount), else_=0)).label('expenses')
        ).filter(
            Transaction.transaction_date >= start_6_months
        ).group_by(
            extract('year', Transaction.transaction_date),
            extract('month', Transaction.transaction_date)
        ).order_by(
            extract('year', Transaction.transaction_date),
            extract('month', Transaction.transaction_date)
        ).all()

        monthly_history = []
        for stat in monthly_stats:
            month_str = f"{int(stat.month):02d}/{int(stat.year)}"
            monthly_history.append(
                MonthlyHistory(
                    month=month_str,
                    incomes=Decimal(str(stat.incomes or 0)),
                    expenses=Decimal(str(stat.expenses or 0))
                )
            )

        # 3. Expenses by Category (for the current period)
        category_stats = db.query(
            Category.name.label('category_name'),
            Category.color,
            Category.icon,
            func.sum(Transaction.amount).label('total_amount')
        ).join(
            Transaction, Transaction.category_id == Category.id
        ).filter(
            Transaction.transaction_type == 'expense',
            Transaction.transaction_date >= start_date,
            Transaction.transaction_date <= end_date
        ).group_by(
            Category.id
        ).order_by(
            func.sum(Transaction.amount).desc()
        ).all()

        expenses_by_category = [
            CategorySummary(
                category_name=c.category_name,
                total_amount=Decimal(str(c.total_amount or 0)),
                color=c.color,
                icon=c.icon
            ) for c in category_stats
        ]

        # 4. Recent Transactions
        recent_txs_db = db.query(Transaction).options(joinedload(Transaction.category)).order_by(
            Transaction.transaction_date.desc(), Transaction.id.desc()
        ).limit(10).all()

        recent_transactions = []
        for tx in recent_txs_db:
            recent_transactions.append(
                RecentTransaction(
                    id=tx.id,
                    title=tx.title,
                    amount=Decimal(str(tx.amount)),
                    transaction_date=tx.transaction_date,
                    transaction_type=tx.transaction_type,
                    category_name=tx.category.name if tx.category else "Unknown",
                    category_color=tx.category.color if tx.category else None,
                    category_icon=tx.category.icon if tx.category else None
                )
            )

        return DashboardResponse(
            summary=summary,
            monthly_history=monthly_history,
            expenses_by_category=expenses_by_category,
            recent_transactions=recent_transactions,
        )
