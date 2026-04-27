import calendar
from datetime import date, timedelta
from typing import Tuple
from dtos.dashboard_dto import DashboardPeriod

class DateHelper:
    @staticmethod
    def get_period_dates(period: DashboardPeriod, reference_date: date = None) -> Tuple[date, date]:
        if reference_date is None:
            reference_date = date.today()
            
        if period == DashboardPeriod.CURRENT_MONTH:
            start_date = reference_date.replace(day=1)
            end_date = reference_date.replace(day=calendar.monthrange(reference_date.year, reference_date.month)[1])
        elif period == DashboardPeriod.LAST_MONTH:
            first_day_this_month = reference_date.replace(day=1)
            last_month_end = first_day_this_month - timedelta(days=1)
            start_date = last_month_end.replace(day=1)
            end_date = last_month_end
        elif period == DashboardPeriod.LAST_6_MONTHS:
            month = reference_date.month - 5
            year = reference_date.year
            if month <= 0:
                month += 12
                year -= 1
            start_date = date(year, month, 1)
            end_date = reference_date.replace(day=calendar.monthrange(reference_date.year, reference_date.month)[1])
        elif period == DashboardPeriod.CURRENT_YEAR:
            start_date = reference_date.replace(month=1, day=1)
            end_date = reference_date.replace(month=12, day=31)
        else:
            # Default to current month
            start_date = reference_date.replace(day=1)
            end_date = reference_date.replace(day=calendar.monthrange(reference_date.year, reference_date.month)[1])
            
        return start_date, end_date

    @staticmethod
    def get_last_n_months(reference_date: date, n: int) -> list[Tuple[int, int]]:
        months = []
        for i in range(n - 1, -1, -1):
            m = reference_date.month - i
            y = reference_date.year
            while m <= 0:
                m += 12
                y -= 1
            months.append((y, m))
        return months
