import requests
import json

BASE_URL = "http://localhost:8000"


def test_all_products():
    print("🧪 Testing ALL Products API...")

    try:
        response = requests.get(f"{BASE_URL}/api/v1/products/")
        print(f"Status Code: {response.status_code}")

        if response.status_code == 200:
            products = response.json()
            print(f"✅ Success! Found {len(products)} products")
            print("\n📦 All Products in Database:")
            for product in products:
                print(
                    f"  - ID: {product['id']}, {product['name']} (${product['price']}) - {product['category']}")
        else:
            print(f"❌ Error: {response.text}")

    except Exception as e:
        print(f"❌ Exception: {e}")


if __name__ == "__main__":
    test_all_products()
