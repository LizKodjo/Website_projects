from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.security import get_current_user
from app.db.session import get_db
from app.models.product import Product
from app.schemas.product import ProductCreate, ProductOut

router = APIRouter()


@router.post("/create", response_model=ProductOut)
def create_product(product: ProductCreate, db: Session = Depends(get_db), user=Depends(get_current_user)):
    if user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    db_product = Product(**product.model_dump())
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product


@router.get("/", response_model=list[ProductOut])
def list_products(category: str = None, search: str = None, sort_by: str = "created_at", order: str = "desc", skip: int = 0, limit: int = 10,  db: Session = Depends(get_db)):
    query = db.query(Product).filter(Product.is_active == True)
    if category:
        query = query.filter(Product.category.ilike(f"%{category}%"))
    if search:
        query = query.filter(Product.name.ilike(f"%{search}%"))
    if sort_by in ["price", "created_at"]:
        sort_column = getattr(Product, sort_by)
        query = query.order_by(sort_column.desc() if order ==
                               "desc" else sort_column.asc())

    return query.offset(skip).limit(limit).all()


@router.get("/{product_id}", response_model=ProductOut)
def get_product(product_id: int, db: Session = Depends(get_db)):
    product = db.query(Product).get(product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product


@router.put("/{product_id}/deactivate")
def deactivate_product(product_id: int, db: Session = Depends(get_db), user=Depends(get_current_user)):
    if user.role != "admin":
        raise HTTPException(status_code=403)
    product = db.query(Product).get(product_id)
    product.is_active = False
    db.commit()
    return {"message": "Product deactivated"}


@router.put("/{product_id}/toggle")
def toggle_product_visibility(product_id: int, db: Session = Depends(get_db), user=Depends(get_current_user)):
    if user.role != "admin":
        raise HTTPException(status_code=403)
    product = db.query(Product).get(product_id)
    if not product:
        raise HTTPException(status_code=404)
    product.is_active = not product.is_active
    db.commit()
    return {"message": f"Product {'activated' if product.is_active else 'deactivated'}"}
