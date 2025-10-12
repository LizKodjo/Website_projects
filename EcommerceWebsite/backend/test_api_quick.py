import requests

try:
    response = requests.get('http://localhost:8000/api/v1/products/')
    print(f"Status: {response.status_code}")
    print(f"Data: {response.json()[:2]}")
except Exception as e:
    print(f"Error: {e}")
