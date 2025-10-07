from db.session import SessionLocal
from models import Product

db = SessionLocal()

products = [Product(name="Test Product", price=9.99,
                    category="test", image_url="", description="Seeded product")]
db.add_all(products)
db.commit()
