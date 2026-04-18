def test_create_category(client):
    response = client.post(
        "/api/categories/",
        json={"name": "Food", "icon": "food", "color": "#FF0000"},
    )
    assert response.status_code == 201
    data = response.json()
    assert "id" in data
    assert data["name"] == "Food"
    assert data["icon"] == "food"
    assert data["color"] == "#FF0000"

def test_get_categories(client):
    # First, create a category
    client.post(
        "/api/categories/",
        json={"name": "Food", "icon": "food", "color": "#FF0000"},
    )
    
    response = client.get("/api/categories/")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert "id" in data[0]

def test_delete_category(client):
    # First, we create
    response = client.post(
        "/api/categories/",
        json={"name": "Food", "icon": "food", "color": "#FF0000"},
    )
    category_id = response.json()["id"]
    
    # Then we delete
    response = client.delete(f"/api/categories/{category_id}")
    assert response.status_code == 204
    
    # Check if it was deleted
    response = client.get("/api/categories/")
    assert len(response.json()) == 0

def test_delete_category_not_found(client):
    response = client.delete("/api/categories/non-existent")
    assert response.status_code == 404
    assert response.json()["detail"] == "Category not found"

def test_create_category_duplicate_name(client):
    # First, create a category
    client.post(
        "/api/categories/",
        json={"name": "Food", "icon": "food", "color": "#FF0000"},
    )
    
    # Try to create the same category again
    response = client.post(
        "/api/categories/",
        json={"name": "Food", "icon": "food", "color": "#FF0000"},
    )
    
    assert response.status_code == 400
    assert response.json()["detail"] == "Category with this name already exists"
