from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.product import Product

router = APIRouter()


@router.get("/")
def get_products(db: Session = Depends(get_db)):
    """Get all products - show all products without limits"""
    try:
        print("🔍 Products endpoint called - fetching ALL products")

        # Get ALL products without limits
        products = db.query(Product).all()
        print(f"✅ Found {len(products)} total products in database")

        # Manual serialization
        result = []
        for product in products:
            result.append({
                "id": product.id,
                "name": product.name,
                "description": product.description,
                "price": float(product.price) if product.price else 0.0,
                "category": product.category,
                "stock_quantity": product.stock_quantity,
                "image_url": product.image_url,
                "is_active": product.is_active,
                "created_at": product.created_at.isoformat() if product.created_at else None,
                "updated_at": product.updated_at.isoformat() if product.updated_at else None
            })

        print(f"✅ Returning {len(result)} products to frontend")
        return result

    except Exception as e:
        print(f"❌ ERROR in products endpoint: {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(
            status_code=500, detail=f"Internal server error: {str(e)}")


@router.get("/{product_id}")
def get_product(product_id: int, db: Session = Depends(get_db)):
    """Get a specific product"""
    try:
        product = db.query(Product).filter(Product.id == product_id).first()
        if not product:
            raise HTTPException(status_code=404, detail="Product not found")

        return {
            "id": product.id,
            "name": product.name,
            "description": product.description,
            "price": float(product.price) if product.price else 0.0,
            "category": product.category,
            "stock_quantity": product.stock_quantity,
            "image_url": product.image_url
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/categories/")
def get_categories(db: Session = Depends(get_db)):
    """Get all categories"""
    try:
        from sqlalchemy import distinct

        categories = db.query(distinct(Product.category)).all()
        return {"categories": [cat[0] for cat in categories if cat[0]]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
