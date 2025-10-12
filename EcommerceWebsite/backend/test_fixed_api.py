import requests
import json

BASE_URL = "http://localhost:8000"


def test_fixed_endpoints():
    print("🧪 Testing Fixed API Endpoints...")

    try:
        # Test 1: Root endpoint
        response = requests.get(f"{BASE_URL}/")
        print(f"✅ Root endpoint: {response.status_code}")

        # Test 2: Get all products
        response = requests.get(f"{BASE_URL}/api/v1/products/")
        products = response.json()
        print(
            f"✅ Get products: {response.status_code} - {len(products)} products")

        # Test 3: Get categories
        response = requests.get(f"{BASE_URL}/api/v1/products/categories/")
        print(f"✅ Get categories: {response.status_code}")

        # Test 4: Create a product
        new_product = {
            "name": "Test Product from Fixed API",
            "description": "Test description",
            "price": 49.99,
            "category": "electronics",
            "stock_quantity": 10
        }
        response = requests.post(
            f"{BASE_URL}/api/v1/products/",
            json=new_product
        )
        if response.status_code == 200:
            created_product = response.json()
            print(
                f"✅ Create product: {response.status_code} - ID: {created_product['id']}")
        else:
            print(
                f"❌ Create product: {response.status_code} - {response.text}")

        print("\n🎉 Fixed API Testing Completed!")

    except Exception as e:
        print(f"❌ Error: {e}")


if __name__ == "__main__":
    test_fixed_endpoints()
