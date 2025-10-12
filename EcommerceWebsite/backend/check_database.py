from app.db.session import SessionLocal
from app.models.product import Product


def check_database():
    db = SessionLocal()
    try:
        # Check if products table exists and has data
        product_count = db.query(Product).count()
        print(f"📊 Products in database: {product_count}")

        if product_count > 0:
            products = db.query(Product).limit(3).all()
            print("Sample products:")
            for product in products:
                print(
                    f"  - {product.name} (${product.price}) - {product.category}")
        else:
            print("❌ No products found in database")

    except Exception as e:
        print(f"❌ Error checking database: {e}")
    finally:
        db.close()


if __name__ == "__main__":
    check_database()
