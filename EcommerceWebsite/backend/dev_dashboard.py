import requests
from datetime import datetime

BASE_URL = "http://localhost:8000"


def development_dashboard():
    print("🚀 Ecommerce Development Dashboard")
    print("=" * 50)

    try:
        # Test API connectivity
        response = requests.get(f"{BASE_URL}/health")
        status = "✅ Online" if response.status_code == 200 else "❌ Offline"
        print(f"Backend Status: {status}")

        # Get prodcuts count
        response = requests.get(f"{BASE_URL}/api/v1/products")
        products = response.json()
        print(f"Products in database: {len(products)}")

        # Get categories
        response = requests.get(f"{BASE_URL}/api/v1/products/categories/")
        categories = response.json().get('categories', [])
        print(f"Available categories: {', '.join(categories)}")

        # Display sample products
        if products:
            print("\n📦 Sample Products:")
            for product in products[:3]:  # Show first 3 products
                print(
                    f" - {product['name']} (${product['price']}) - {product['category']}")

        print(
            f"\n⏰ Last updated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        print("\n🎯 Next steps:")
        print(" 1. Start frontent: cd frontend && npm run dev")
        print(" 2. Test API endpoints with the frontend")
        print(" 3. Implement user authentication")
        print(" 4. Add shopping cart functionality")

    except Exception as e:
        print(f"❌ Could not connect to backend: {e}")


if __name__ == "__main__":
    development_dashboard()
