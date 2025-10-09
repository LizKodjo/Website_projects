def test_get_products():
    response = client.get("/api/v1/products/")
    assert response.status_code == 200
    assert isinstance(response.json(), list)


def test_create_product():
    product_data = {
        "name": "Test Product",
        "description": "Test Description",
        "price": 29.99,
        "category": "Test Category",
        "stock_quantity": 10
    }
    response = client.post("/api/v1/products/", json=product_data)
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == product_data["name"]
    assert data["price"] == product_data["price"]
