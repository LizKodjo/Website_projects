from typing import Optional
from app.crud.base import CRUDBase
from app.models.product import Product
from app.schemas.product import ProductCreate, ProductUpdate
from sqlalchemy.orm import Session


class CRUDProduct(CRUDBase[Product, ProductCreate, ProductUpdate]):
    def get_products(self, db: Session, *, skip: int = 0, limit: int = 100, category: Optional[str] = None):
        query = db.query(self.model)
        if category:
            query = query.filter(self.model.category == category)
        return query.offset(skip).limit(limit).all()

    def get_product(self, db: Session, product_id: int):
        return db.query(self.model).filter(self.model.id == product_id).first()


product = CRUDProduct(Product)
