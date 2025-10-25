from app.db.base import Base
from app.db.session import engine
from app.models.product import Product
from app.models.user import User
from app.models.order import Order, OrderItem

def recreate_database():
    # Drop all tables
    Base.metadata.drop_all(bind=engine)
    print("✅ Dropped all existing tables")
    
    # Create all tables with updated schema
    Base.metadata.create_all(bind=engine)
    print("✅ Created all tables with updated schema")
    print("📊 Tables created: products, users, orders, order_items")

if __name__ == "__main__":
    recreate_database()