from sqlalchemy import Boolean, Column, DateTime, Integer, String, Float, Text
from app.db.session import Base
from datetime import datetime


class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    description = Column(Text)
    price = Column(Float)
    category = Column(String, index=True)
    image_url = Column(String)
    stock = Column(Integer)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.now())
    updated_at = Column(DateTime, default=datetime.now(),
                        onupdate=datetime.now())
    is_active = Column(Boolean, default=True)
