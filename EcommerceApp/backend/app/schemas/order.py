from pydantic import BaseModel
from datetime import datetime

from app.schemas.product import ProductOut


class OrderBase(BaseModel):
    user_id: int
    total: float
    status: str = "pending"


class OrderCreate(BaseModel):
    total: float


class OrderItemCreate(BaseModel):
    product_id: int
    quantity: int


class OrderItemOut(BaseModel):
    id: int
    order_id: int
    product_id: int
    quantity: int
    product: ProductOut


class OrderOut(OrderCreate):
    id: int
    status: str
    created_at: datetime
    shipping_address: str
    items: list[OrderItemOut]
