from pydantic import BaseModel
from sqlalchemy import Boolean, Column, Integer, String, Float, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from app.db.session import Base
from datetime import datetime

from app.schemas.product import ProductOut


class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    total = Column(Float)
    status = Column(String, default="pending")
    shipping_address = Column(String)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.now())
    updated_at = Column(DateTime, default=datetime.now(),
                        onupdate=datetime.now())

    user = relationship("User", back_populates="orders")
    items = relationship("OrderItem", backref="order", cascade="all, delete")


class OrderItem(Base):
    __tablename__ = "order_items"
    id = Column(Integer, primary_key=True)
    order_id = Column(Integer, ForeignKey("orders.id"))
    product_id = Column(Integer, ForeignKey("products.id"))
    quantity = Column(Integer)
    product = relationship("Product")


class OrderItemCreate(BaseModel):
    product_id: int
    quantity: int


class OrderCreate(BaseModel):
    total: float
    items: list[OrderItemCreate]
    shipping_address: str


class OrderItemOut(OrderItemCreate):
    id: int
    product: ProductOut


class OrderOut(BaseModel):
    id: int
    total: float
    status: str
    shipping_address: str
    created_at: datetime
    items: list[OrderItemOut]
