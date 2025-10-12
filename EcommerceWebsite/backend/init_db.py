from app.db.base import Base
from app.db.session import engine
from app.models.product import Product
from app.models.user import User
from app.models.order import Order, OrderItem


def init_database():
    # Create all tables
    Base.metadata.create_all(bind=engine)
    print("✅ Database tables created successfully!")
    print("📊 Tables created: products, users, orders, order_items")


if __name__ == "__main__":
    init_database()
