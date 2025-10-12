import requests

BASE_URL = "http://localhost:8000"


def test_simple():
    print("🧪 Testing Simple API...")

    try:
        # Test products endpoint
        response = requests.get(f"{BASE_URL}/api/v1/products/")
        print(f"Products endpoint: {response.status_code}")
        if response.status_code == 200:
            products = response.json()
            print(f"Found {len(products)} products")
            for product in products[:3]:  # Show first 3
                print(f"  - {product['name']} (${product['price']})")

        # Test categories
        response = requests.get(f"{BASE_URL}/api/v1/products/categories/")
        print(f"Categories: {response.json()}")

    except Exception as e:
        print(f"Error: {e}")


if __name__ == "__main__":
    test_simple()
