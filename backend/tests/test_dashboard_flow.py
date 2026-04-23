import pytest
from fastapi.testclient import TestClient

def test_get_dashboard_data_success(client: TestClient):
    """
    Test that the dashboard endpoint returns HTTP 200 and matches the expected schema.
    Since the service is currently stubbed, we expect the hardcoded values.
    """
    # Arrange
    # (No specific arrangement needed for the stubbed service)

    # Act
    response = client.get("/api/dashboard/")

    # Assert
    assert response.status_code == 200
    
    data = response.json()
    
    # Assert schema for summary
    assert "summary" in data
    summary = data["summary"]
    assert "total_incomes" in summary
    assert "total_expenses" in summary
    assert "current_balance" in summary
    assert "period_expenses" in summary
    
    # Assert schema for monthly_history
    assert "monthly_history" in data
    assert isinstance(data["monthly_history"], list)
    if len(data["monthly_history"]) > 0:
        history_item = data["monthly_history"][0]
        assert "month" in history_item
        assert "incomes" in history_item
        assert "expenses" in history_item
        
    # Assert schema for expenses_by_category
    assert "expenses_by_category" in data
    assert isinstance(data["expenses_by_category"], list)
    if len(data["expenses_by_category"]) > 0:
        category_item = data["expenses_by_category"][0]
        assert "category_name" in category_item
        assert "total_amount" in category_item
        # color and icon are optional but let's check they exist in our stub
        assert "color" in category_item
        assert "icon" in category_item
        
    # Assert schema for recent_transactions
    assert "recent_transactions" in data
    assert isinstance(data["recent_transactions"], list)
    if len(data["recent_transactions"]) > 0:
        transaction = data["recent_transactions"][0]
        assert "id" in transaction
        assert "title" in transaction
        assert "amount" in transaction
        assert "transaction_date" in transaction
        assert "transaction_type" in transaction
        assert "category_name" in transaction

def test_get_dashboard_data_with_period(client: TestClient):
    """
    Test that the dashboard endpoint accepts a period query parameter.
    """
    # Act
    response = client.get("/api/dashboard/?period=last_month")

    # Assert
    assert response.status_code == 200
