import requests
import time


def test_backend():
    base_url = "http://localhost:8000"
    endpoints = ["/", "/health", "/docs"]

    print("Testing backend connection...")

    for endpoint in endpoints:
        try:
            response = requests.get(f"{base_url}{endpoint}", timeout=5)
            print(f"✅ {endpoint}: Status {response.status_code}")
        except requests.exceptions.ConnectionError:
            print(f"❌ {endpoint}: Connection refused - Backend not running")
        except requests.exceptions.Timeout:
            print(f"❌ {endpoint}: Request timeout")
        except Exception as e:
            print(f"❌ {endpoint}: Error - {e}")


if __name__ == "__main__":
    test_backend()
