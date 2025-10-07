from datetime import datetime
from pydantic import BaseModel, field_validator, validator


# class ProductBase(BaseModel):
#     name: str
#     description: str
#     price: float
#     category: str
#     image_url: str
#     stock: int


class ProductCreate(BaseModel):
    name: str
    price: float
    image_url: str
    category: str
    description: str

    @field_validator("price")
    def price_must_be_positive(cls, v):
        if v <= 0:
            raise ValueError("Price must be greater than zero")
        return v


class ProductOut(ProductCreate):
    id: int
    created_at: datetime
    updated_at: datetime
    is_active: bool
