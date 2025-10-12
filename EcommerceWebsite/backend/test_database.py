from app.db.session import SessionLocal
from app.models.product import Product


def test_database():
    db = SessionLocal()
    try:
        print("🔍 Testing database connection...")

        # Test basic connection
        result = db.execute("SELECT 1")
        print("✅ Database connection works")

        # Test products table
        product_count = db.query(Product).count()
        print(f"✅ Products table exists, contains {product_count} products")

        # Show first few products
        products = db.query(Product).limit(3).all()
        for product in products:
            print(f"  - {product.name}: ${product.price} ({product.category})")

    except Exception as e:
        print(f"❌ Database error: {e}")
        import traceback
        traceback.print_exc()
    finally:
        db.close()


if __name__ == "__main__":
    test_database()
