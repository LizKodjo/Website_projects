from app.core.security import get_password_hash
from app.db.session import SessionLocal
from app.models.product import Product
from app.models.user import User


def create_sample_data():
    db = SessionLocal()

    try:
        # Clear existing data (optional - be careful in production!)
        # db.query(Product).delete()
        # db.query(User).delete()
        # db.commit()

        # Create sample products
        sample_products = [
            Product(
                name="Wireless Bluetooth Headphones",
                description="High quality wireless headphones with noise cancellation",
                price=99.99,
                category="Electronics",
                stock_quantity=50,
                image_url="/images/headphones.jpg"
            ),
            Product(
                name="Smartphone",
                description="Latest smartphone with advanced camera.",
                price=699.99,
                category="Electronics",
                stock_quantity=25,
                image_url="/images/smartphone.jpg"
            ),
            Product(
                name="Cotton T-Shirt",
                description="Comfortable cotton t-shirt in various colours.",
                price=19.99,
                category="Clothing",
                stock_quantity=100,
                image_url="/images/tshirt.jpg"
            ),
            Product(
                name="Running Shoes",
                description="Lightweight running shoes for maximum comfort.",
                price=89.99,
                category="Footwear",
                stock_quantity=30,
                image_url="/images/shoes.jpg"
            ),
            Product(
                name="Coffee Maker",
                description="Automatic coffee maker with timer.",
                price=49.99,
                category="Home",
                stock_quantity=15,
                image_url="/images/coffee-maker.jpg"
            )
        ]

        for product in sample_products:
            db.add(product)

        # Create sample user
        sample_users = [
            User(

                email="user@example.com",
                hashed_password=get_password_hash("pass"),
                name="John Doe",
                is_active=True
            ),
            # db.add(sample_user)

            # Create admin user
            User(
                email="admin@example.com",
                hashed_password=get_password_hash("admi"),
                name="Admin User",
                is_active=True,
                is_superuser=True
            )]

        for user in sample_users:
            db.add(user)

        db.commit()
        print("✅ Sample data created successfully.")
        print(f"📦 Created {len(sample_products)} products.")
        print(f"😊 Created {len(sample_users)} users")
        print("🔑 User credentials: ")
        print(" user@example.com / pass")
        print(" admin@example.com / admi")

    except Exception as e:
        db.rollback()
        print(f"❌ Error creating sample data: {e}")
        import traceback
        traceback.print_exc()
    finally:
        db.close()


if __name__ == "__main__":
    create_sample_data()
