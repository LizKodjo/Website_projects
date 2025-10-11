from sqlalchemy.orm import relationship


def setup_relationships():
    from app.models.order import Order, OrderItem
    from app.models.user import User
    from app.models.product import Product

    # User-Order relationship
    User.orders = relationship("Order", back_populates="user")
    Order.user = relationship("User", back_populates="orders")

    # Order-OrderItem relationship
    Order.items = relationship("OrderItem", back_populates="order")
    OrderItem.order = relationship("Order", back_populates="items")

    # OrderItem-Product relationship
    OrderItem.product = relationship("Product")


# Call this function after all models are imported
setup_relationships()
