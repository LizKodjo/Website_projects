from typing import List, Optional
from sqlalchemy import distinct, or_
from app.crud.base import CRUDBase
from app.models.product import Product
from app.schemas.product import ProductCreate, ProductUpdate
from sqlalchemy.orm import Session


class CRUDProduct(CRUDBase[Product, ProductCreate, ProductUpdate]):
    def get_products(self, db: Session, *, skip: int = 0, limit: int = 100,
                     category: Optional[str] = None, min_price: Optional[float] = None,
                     max_price: Optional[float] = None, search: Optional[str] = None) -> List[Product]:

        query = db.query(self.model).filter(self.model.is_active == True)

        if category:
            query = query.filter(self.model.category == category)
        if min_price is not None:
            query = query.filter(self.model.price >= min_price)
        if max_price is not None:
            query = query.filter(self.model.price <= max_price)

        if search:
            search_filter = or_(self.model.name.ilike(
                f"%{search}%"), self.model.description.ilike(f"%{search}%"))
            query = query.filter(search_filter)

        return query.offset(skip).limit(limit).all()

    def get_product(self, db: Session, product_id: int) -> Optional[Product]:
        return db.query(self.model).filter(self.model.id == product_id, self.model.is_active == True).first()

    def create_product(self, db: Session, product: ProductCreate) -> Product:
        db_product = Product(**product.model_dump())
        db.add(db_product)
        db.commit()
        db.refresh(db_product)
        return db_product

    def update_product(self, db: Session, db_product: Product, product_update: ProductUpdate) -> Product:
        update_data = product_update.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_product, field, value)
        db.add(db_product)
        db.commit()
        db.refresh(db_product)
        return db_product

    def soft_delete(self, db: Session, product_id: int) -> Product:
        product = self.get_product(db, product_id)
        if product:
            product.is_active = False
            db.add(product)
            db.commit()
            db.refresh(product)
        return product

    def get_categories(self, db: Session) -> List[str]:
        categories = db.query(distinct(self.model.category)).filter(
            self.model.category.isnot(None), self.model.is_active == True).all()
        return [category[0] for category in categories if category[0]]


product = CRUDProduct(Product)
