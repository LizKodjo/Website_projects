import requests

BASE_URL = "http://localhost:8000"


def test_routes():
    print("🔍 Testing available routes...")

    # Test different possible endpoints
    endpoints = [
        "/",
        "/api/v1/products/",
        "/api/v1/products",
        "/products/",
        "/products",
        "/api/v1/auth/",
        "/auth/"
    ]

    for endpoint in endpoints:
        try:
            response = requests.get(f"{BASE_URL}{endpoint}")
            print(f"{endpoint:.<30} {response.status_code}")
            if response.status_code == 200:
                data = response.json()
                if isinstance(data, list) and len(data) > 0:
                    print(f"    Found {len(data)} items")
                elif isinstance(data, dict):
                    print(f"    Response: {list(data.keys())}")
        except Exception as e:
            print(f"{endpoint:.<30} ERROR: {e}")


if __name__ == "__main__":
    test_routes()
