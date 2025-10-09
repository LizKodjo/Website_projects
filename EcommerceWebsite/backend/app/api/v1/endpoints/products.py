from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.schemas.product import Product, ProductCreate, ProductUpdate
from app.crud import product as product_crud


router = APIRouter()


@router.get("/", response_model=List[Product])
def get_products(skip: int = 0, limit: int = 100, category: Optional[str] = None, db: Session = Depends(get_db)):
    """Get all products"""
    products = product_crud.get_products(
        db, skip=skip, limit=limit, category=category)
    return products


@router.get("/{product_id}", response_model=Product)
def get_product(product_id: int, db: Session = Depends(get_db)):
    """Get a single product by ID"""
    product = product_crud.get_product(db, product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product


@router.post("/", response_model=Product)
def create_product(product: ProductCreate, db: Session = Depends(get_db)):
    """Create a new product"""
    return product_crud.create_product(db, product)
