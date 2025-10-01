from pydantic import BaseModel
from datetime import datetime


class OrderBase(BaseModel):
    user_id: int
    total: float
    status: str = "pending"


class OrderCreate(OrderBase):
    pass


class OrderOut(OrderBase):
    id: int
    created_at: datetime

    class Config:
        orm_mode = True
