from datetime import date
from decimal import Decimal
from unittest.mock import MagicMock, patch

import pytest

from dtos.dashboard_dto import DashboardPeriod
from services.dashboard_service import DashboardService


@pytest.fixture
def mock_transaction_repository():
    repo = MagicMock()
    repo.db = MagicMock()
    return repo


@pytest.fixture
def dashboard_service(mock_transaction_repository):
    return DashboardService(transaction_repository=mock_transaction_repository)


def test_get_dashboard_summary_refactored(
    dashboard_service, mock_transaction_repository
):
    # Mock do repositório usando os novos métodos
    mock_transaction_repository.get_total_by_type.side_effect = [
        Decimal("1000.00"),  # income
        Decimal("400.00"),  # expense
    ]
    mock_transaction_repository.get_period_expenses.return_value = Decimal("200.00")

    # Mock para Monthly History
    mock_stat = MagicMock()
    mock_stat.year = 2026
    mock_stat.month = 4
    mock_stat.incomes = Decimal("1000.00")
    mock_stat.expenses = Decimal("400.00")
    mock_transaction_repository.get_monthly_history.return_value = [mock_stat]

    # Mock para Expenses by Category
    # Retorna uma lista de tuplas (name, color, icon, total)
    mock_transaction_repository.get_expenses_by_category.return_value = [
        ("Food", "blue", "fastfood", Decimal("200.00"))
    ]

    # Mock para Recent Transactions
    mock_tx = MagicMock()
    mock_tx.id = "1"
    mock_tx.title = "Lunch"
    mock_tx.amount = Decimal("20.00")
    mock_tx.transaction_date = date(2026, 4, 27)
    mock_tx.transaction_type = "expense"
    mock_tx.category.name = "Food"
    mock_tx.category.color = "blue"
    mock_tx.category.icon = "fastfood"
    mock_transaction_repository.get_recent_transactions.return_value = [mock_tx]

    # Act
    with patch("services.dashboard_service.date") as mock_date:
        mock_date.today.return_value = date(2026, 4, 27)
        mock_date.side_effect = lambda *args, **kw: date(*args, **kw)

        response = dashboard_service.get_dashboard_summary(
            DashboardPeriod.CURRENT_MONTH
        )

    # Assert
    assert response.summary.total_incomes == Decimal("1000.00")
    assert response.summary.total_expenses == Decimal("400.00")
    assert response.summary.current_balance == Decimal("600.00")
    assert response.summary.period_expenses == Decimal("200.00")
    assert len(response.monthly_history) == 6
    assert response.monthly_history[-1].month == "04/2026"
    assert response.monthly_history[-1].incomes == Decimal("1000.00")

    assert len(response.expenses_by_category) == 1
    assert response.expenses_by_category[0].category_name == "Food"

    assert len(response.recent_transactions) == 1
    assert response.recent_transactions[0].title == "Lunch"
