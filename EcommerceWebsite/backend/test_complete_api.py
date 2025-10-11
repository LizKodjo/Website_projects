import requests
import json


BASE_URL = "http://localhost:8000"


def test_all_endpoints():
    print("Testing Ecommerce API...")

    # Test root endpoint
    response = requests.get(f"{BASE_URL}/")
    print(f"✔ Root endpoint: {response.status_code}")

    # Test health check
    response = requests.get(f"{BASE_URL}/health")
    print(f"✔ Health check: {response.status_code}")

    # Test getting products
    response = requests.get(f"{BASE_URL}/api/v1/products")
    print(
        f"✔ Get products: {response.status_code} - {len(response.json())} products")

    # Test getting categories
    response = requests.get(f"{BASE_URL}/api/v1/products/categories/")
    print(f"✔ Get categories: {response.status_code}")

    # Test creating a product
    new_product = {
        "name": "Test Product from API",
        "description": "Test description",
        "price": 49.99,
        "category": "Electronics",
        "stock_quantity": 10
    }

    response = requests.post(f"{BASE_URL}/api/v1/products/", json=new_product)

    print(f"✔ Create product: {response.status_code}")

    if response.status_code == 200:
        product_id = response.json()["id"]

        # Test getting single product
        response = requests.get(f"{BASE_URL}/api/v1/products/{product_id}")
        print(f"✔ Get single product: {response.status_code}")

    print("\n🥂 All tests completed!")


if __name__ == "__main__":
    test_all_endpoints()
