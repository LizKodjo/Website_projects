from datetime import datetime
from typing import List
from pydantic import BaseModel


class OrderItemBase(BaseModel):
    product_id: int
    quantity: int
    price: float


class OrderItemCreate(OrderItemBase):
    pass


class OrderItem(OrderItemBase):
    id: int
    order_id: int

    class Config:
        from_attributes = True


class OrderBase(BaseModel):
    total_amount: float
    shipping_address: str


class OrderCreate(OrderBase):
    items: List[OrderItemCreate]


class Order(OrderBase):
    id: int
    user_id: int
    status: str
    created_at: datetime
    items: List[OrderItem]

    class Config:
        from_attributes = True
