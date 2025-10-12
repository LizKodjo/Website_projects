from app.db.session import SessionLocal
from app.models.product import Product


def check_all_products():
    db = SessionLocal()
    try:
        # Get ALL products from database
        products = db.query(Product).all()
        print(f"📊 Total products in database: {len(products)}")

        print("\n🎯 All Products:")
        for product in products:
            print(
                f"  - ID: {product.id}, {product.name} (${product.price}) - {product.category}")

        # Check categories
        categories = db.query(Product.category).distinct().all()
        print(f"\n🏷️ All Categories: {[cat[0] for cat in categories]}")

    except Exception as e:
        print(f"❌ Error: {e}")
    finally:
        db.close()


if __name__ == "__main__":
    check_all_products()
