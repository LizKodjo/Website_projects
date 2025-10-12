from app.db.session import SessionLocal
from app.models.product import Product


def create_sample_products():
    db = SessionLocal()

    try:
        # Clear existing products
        # db.query(Product).delete()

        # Sample products data
        sample_products = [
            {
                "name": "Wireless Bluetooth Headphones",
                "description": "High-quality wireless headphones with active noise cancellation and 30-hour battery life.",
                "price": 129.99,
                "category": "electronics",
                "stock_quantity": 25,
                "image_url": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop"
            },
            {
                "name": "Smartphone Pro Max",
                "description": "Latest smartphone with advanced camera system, 5G connectivity, and all-day battery.",
                "price": 999.99,
                "category": "electronics",
                "stock_quantity": 15,
                "image_url": "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=300&fit=crop"
            },
            {
                "name": "Cotton T-Shirt - Premium",
                "description": "Soft, comfortable cotton t-shirt available in multiple colors. Machine washable.",
                "price": 24.99,
                "category": "clothing",
                "stock_quantity": 100,
                "image_url": "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=300&fit=crop"
            },
            {
                "name": "Running Shoes - Air Max",
                "description": "Lightweight running shoes with superior cushioning and breathable mesh upper.",
                "price": 89.99,
                "category": "footwear",
                "stock_quantity": 30,
                "image_url": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop"
            },
            {
                "name": "Coffee Maker - Programmable",
                "description": "12-cup programmable coffee maker with built-in grinder and thermal carafe.",
                "price": 79.99,
                "category": "home",
                "stock_quantity": 20,
                "image_url": "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=300&fit=crop"
            },
            {
                "name": "Laptop - Ultra Slim",
                "description": "Powerful ultra-slim laptop with 16GB RAM, 512GB SSD, and 13-inch retina display.",
                "price": 1299.99,
                "category": "electronics",
                "stock_quantity": 10,
                "image_url": "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=300&fit=crop"
            },
            {
                "name": "Denim Jacket - Classic Fit",
                "description": "Classic fit denim jacket with vintage wash and comfortable cotton lining.",
                "price": 59.99,
                "category": "clothing",
                "stock_quantity": 40,
                "image_url": "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=300&fit=crop"
            },
            {
                "name": "Yoga Mat - Premium",
                "description": "Non-slip premium yoga mat with extra cushioning and carrying strap.",
                "price": 34.99,
                "category": "sports",
                "stock_quantity": 50,
                "image_url": "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=300&fit=crop"
            },
            {
                "name": "Smart Watch - Series 5",
                "description": "Advanced smartwatch with health monitoring, GPS, and waterproof design.",
                "price": 299.99,
                "category": "electronics",
                "stock_quantity": 18,
                "image_url": "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop"
            },
            {
                "name": "Backpack - Waterproof",
                "description": "Durable waterproof backpack with laptop compartment and multiple pockets.",
                "price": 49.99,
                "category": "accessories",
                "stock_quantity": 35,
                "image_url": "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=300&fit=crop"
            },
            {
                "name": "Desk Lamp - LED",
                "description": "Modern LED desk lamp with adjustable brightness and color temperature.",
                "price": 39.99,
                "category": "home",
                "stock_quantity": 25,
                "image_url": "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&h=300&fit=crop"
            },
            {
                "name": "Sunglasses - Aviator",
                "description": "Classic aviator sunglasses with UV protection and polarized lenses.",
                "price": 79.99,
                "category": "accessories",
                "stock_quantity": 60,
                "image_url": "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=300&fit=crop"
            }
        ]

        # Create products
        for product_data in sample_products:
            product = Product(**product_data)
            db.add(product)

        db.commit()
        print("✅ Sample products created successfully!")
        print(
            f"📦 Created {len(sample_products)} products across multiple categories")

        # Show categories created
        categories = db.query(Product.category).distinct().all()
        print("🏷️ Categories available:", [cat[0] for cat in categories])

    except Exception as e:
        db.rollback()
        print(f"❌ Error creating sample products: {e}")
        import traceback
        traceback.print_exc()
    finally:
        db.close()


if __name__ == "__main__":
    create_sample_products()
