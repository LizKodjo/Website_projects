import requests

BASE_URL = "http://localhost:8000"


def test_endpoints():
    # Test root endpoint
    response = requests.get(f"{BASE_URL}/")
    print("Root endpoint:", response.json())

    # Test products endpoint
    response = requests.get(f"{BASE_URL}/api/v1/products/")
    print("Products endpoint:", response.json())

    # Test creating a product
    product_data = {
        "name": "Test Product",
        "description": "Test Description",
        "price": 29.99,
        "category": "Electronics",
        "stock_quantity": 10
    }

    response = requests.post(f"{BASE_URL}/api/v1/products/", json=product_data)
    print("Create product:", response.json())


if __name__ == "__main__":
    test_endpoints()
