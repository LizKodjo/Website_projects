from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.schemas.product import Product, ProductCreate, ProductUpdate
from app.crud import product as product_crud


router = APIRouter()


@router.get("/", response_model=List[Product])
def get_products(skip: int = 0, limit: int = 100, category: Optional[str] = None, min_price: Optional[float] = Query(None, ge=0), max_price: Optional[float] = Query(None, ge=0), search: Optional[str] = None, db: Session = Depends(get_db)):
    """Get all products"""
    products = product_crud.get_products(
        db, skip=skip, limit=limit, category=category, min_price=min_price, max_price=max_price, search=search)
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


@router.put("/{product_id}", response_model=Product)
def update_product(product_id: int, product_update: ProductUpdate, db: Session = Depends(get_db)):
    """Update a product"""
    product = product_crud.get_product(db, product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found.")
    return product_crud.update_product(db, product, product_update)


@router.delete("/{product_id}")
def delete_product(product_id: int, db: Session = Depends(get_db)):
    """Delete a product (soft delete)"""
    product = product_crud.get_product(db, product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    product_crud.soft_delete(db, product_id)
    return {"message": "Product deleted successfully."}


@router.get("/categories/")
def get_categories(db: Session = Depends(get_db)):
    """Get all available product categories"""
    categories = product_crud.get_categories(db)
    return {"categories": categories}
