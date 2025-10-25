from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, ConfigDict


class OrderItemBase(BaseModel):
    product_id: int
    product_name: str    
    product_price: float
    quantity: int


class OrderItemCreate(OrderItemBase):
    pass


class OrderItem(OrderItemBase):
    id: int
    order_id: int

    model_config = ConfigDict(from_attributes=True)


class OrderBase(BaseModel):
    shipping_address: str
    payment_method: str = "credit_card"


class OrderCreate(OrderBase):
    items: List[OrderItemCreate]


class Order(OrderBase):
    id: int
    user_id: int
    order_number: str
    total_amount: float
    status: str
    payment_status: str
    created_at: datetime
    updated_at: Optional[datetime] = None
    items: List[OrderItem]

    model_config = ConfigDict(from_attributes=True)
    
class OrderUpdate(BaseModel):
    status: Optional[str] = None
    payment_status: Optional[str] = None
