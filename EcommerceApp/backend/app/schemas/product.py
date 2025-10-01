from pydantic import BaseModel


class ProductBase(BaseModel):
    name: str
    description: str
    price: float
    category: str
    image_url: str
    stock: int


class ProductCreate(ProductBase):
    pass


class ProductOut(ProductBase):
    id: int

    class Config:
        orm_mode = True
