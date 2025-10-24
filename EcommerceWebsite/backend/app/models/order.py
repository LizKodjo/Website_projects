from sqlalchemy import Column, DateTime, Float, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.base import Base


class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    order_number = Column(String, unique=True, index=True)
    total_amount = Column(Float, nullable=False)
    status = Column(String, default="pending")
    shipping_address = Column(Text)
    payment_method = Column(String, default='credit_card')
    payment_status = Column(String, default='pending')
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    user = relationship("User")
    items = relationship("OrderItem", back_populates="order", cascade="all, delete-orphan")


class OrderItem(Base):
    __tablename__ = "order_items"

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id"))
    product_id = Column(Integer, ForeignKey("products.id"))
    product_name = Column(String, nullable=False)
    product_price = Column(Float, nullable=False)
    quanity = Column(Integer, nullable=False)
  

    # Relationships
    order = relationship("Order", back_populates="items")
    product = relationship("Product")
