from datetime import date
from decimal import Decimal
from enum import Enum
from typing import List, Optional

from pydantic import BaseModel


class DashboardPeriod(str, Enum):
    CURRENT_MONTH = "current_month"
    LAST_MONTH = "last_month"
    LAST_6_MONTHS = "last_6_months"
    CURRENT_YEAR = "current_year"


class DashboardSummary(BaseModel):
    total_incomes: Decimal
    total_expenses: Decimal
    current_balance: Decimal
    period_expenses: Decimal


class MonthlyHistory(BaseModel):
    month: str
    incomes: Decimal
    expenses: Decimal


class CategorySummary(BaseModel):
    category_name: str
    total_amount: Decimal
    color: Optional[str] = None
    icon: Optional[str] = None


class RecentTransaction(BaseModel):
    id: str
    title: str
    amount: Decimal
    transaction_date: date
    transaction_type: str
    category_name: str
    category_color: Optional[str] = None
    category_icon: Optional[str] = None


class DashboardResponse(BaseModel):
    summary: DashboardSummary
    monthly_history: List[MonthlyHistory]
    expenses_by_category: List[CategorySummary]
    recent_transactions: List[RecentTransaction]
