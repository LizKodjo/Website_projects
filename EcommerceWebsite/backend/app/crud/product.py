from sqlalchemy.orm import Session
from typing import List, Optional
from app.models.product import Product
from app.schemas.product import ProductCreate, ProductUpdate

# Simple functions instead of class for now


def get_products(
    db: Session,
    skip: int = 0,
    limit: int = 100,
    category: Optional[str] = None
) -> List[Product]:
    query = db.query(Product)
    if category:
        query = query.filter(Product.category == category)
    return query.offset(skip).limit(limit).all()


def get_product(db: Session, product_id: int) -> Product:
    return db.query(Product).filter(Product.id == product_id).first()


def create_product(db: Session, product: ProductCreate) -> Product:
    db_product = Product(
        name=product.name,
        description=product.description,
        price=product.price,
        category=product.category,
        stock_quantity=product.stock_quantity,
        image_url=product.image_url
    )
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product


def get_categories(db: Session) -> List[str]:
    categories = db.query(Product.category).distinct().all()
    return [category[0] for category in categories if category[0]]
