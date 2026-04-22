def test_create_transaction(client):
    # Arrange
    category_response = client.post(
        "/api/categories/",
        json={"name": "Food", "icon": "food", "color": "#FF0000"},
    )
    category_id = category_response.json()["id"]

    transaction_data = {
        "title": "Lunch",
        "description": "Office lunch",
        "amount": "15.50",
        "transaction_date": "2024-04-22",
        "transaction_type": "expense",
        "category_id": category_id,
    }

    # Act
    response = client.post("/api/transactions/", json=transaction_data)

    # Assert
    assert response.status_code == 201
    data = response.json()
    assert data["title"] == transaction_data["title"]
    assert data["amount"] == transaction_data["amount"]
    assert data["transaction_date"] == transaction_data["transaction_date"]
    assert data["category_id"] == category_id
    assert "id" in data


def test_get_transactions(client):
    # Arrange
    category_response = client.post(
        "/api/categories/",
        json={"name": "Food", "icon": "food", "color": "#FF0000"},
    )
    category_id = category_response.json()["id"]

    client.post(
        "/api/transactions/",
        json={
            "title": "Lunch",
            "amount": "15.50",
            "transaction_date": "2024-04-20",
            "transaction_type": "expense",
            "category_id": category_id,
        },
    )
    client.post(
        "/api/transactions/",
        json={
            "title": "Dinner",
            "amount": "25.00",
            "transaction_date": "2024-04-21",
            "transaction_type": "expense",
            "category_id": category_id,
        },
    )

    # Act
    response = client.get("/api/transactions/")

    # Assert
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 2


def test_get_transactions_with_filters(client):
    # Arrange
    cat_response = client.post(
        "/api/categories/", json={"name": "Food", "icon": "f", "color": "c"}
    )
    cat_id = cat_response.json()["id"]

    client.post(
        "/api/transactions/",
        json={
            "title": "Old Expense",
            "amount": "10.00",
            "transaction_date": "2024-01-01",
            "transaction_type": "expense",
            "category_id": cat_id,
        },
    )
    client.post(
        "/api/transactions/",
        json={
            "title": "New Income",
            "amount": "100.00",
            "transaction_date": "2024-04-22",
            "transaction_type": "income",
            "category_id": cat_id,
        },
    )

    # Act & Assert - Filter by type
    response = client.get("/api/transactions/?transaction_type=income")
    assert len(response.json()) == 1
    assert response.json()[0]["title"] == "New Income"

    # Act & Assert - Filter by date
    response = client.get("/api/transactions/?start_date=2024-04-01")
    assert len(response.json()) == 1
    assert response.json()[0]["title"] == "New Income"


def test_update_transaction(client):
    # Arrange
    cat_response = client.post(
        "/api/categories/", json={"name": "Food", "icon": "f", "color": "c"}
    )
    cat_id = cat_response.json()["id"]

    create_response = client.post(
        "/api/transactions/",
        json={
            "title": "Lunch",
            "amount": "15.50",
            "transaction_date": "2024-04-22",
            "transaction_type": "expense",
            "category_id": cat_id,
        },
    )
    transaction_id = create_response.json()["id"]

    updated_data = {
        "title": "Expensive Lunch",
        "amount": "20.00",
        "transaction_date": "2024-04-22",
        "transaction_type": "expense",
        "category_id": cat_id,
    }

    # Act
    response = client.put(f"/api/transactions/{transaction_id}", json=updated_data)

    # Assert
    assert response.status_code == 200
    assert response.json()["title"] == "Expensive Lunch"
    assert response.json()["amount"] == "20.00"


def test_delete_transaction(client):
    # Arrange
    cat_response = client.post(
        "/api/categories/", json={"name": "Food", "icon": "f", "color": "c"}
    )
    cat_id = cat_response.json()["id"]

    create_response = client.post(
        "/api/transactions/",
        json={
            "title": "Lunch",
            "amount": "15.50",
            "transaction_date": "2024-04-22",
            "transaction_type": "expense",
            "category_id": cat_id,
        },
    )
    transaction_id = create_response.json()["id"]

    # Act
    delete_response = client.delete(f"/api/transactions/{transaction_id}")

    # Assert
    assert delete_response.status_code == 204
    get_response = client.get("/api/transactions/")
    assert len(get_response.json()) == 0


def test_update_transaction_not_found(client):
    # Arrange
    cat_response = client.post(
        "/api/categories/", json={"name": "Food", "icon": "f", "color": "c"}
    )
    cat_id = cat_response.json()["id"]

    # Act
    response = client.put(
        "/api/transactions/non-existent",
        json={
            "title": "Lunch",
            "amount": "15.50",
            "transaction_date": "2024-04-22",
            "transaction_type": "expense",
            "category_id": cat_id,
        },
    )

    # Assert
    assert response.status_code == 404


def test_delete_transaction_not_found(client):
    # Act
    response = client.delete("/api/transactions/non-existent")

    # Assert
    assert response.status_code == 404
