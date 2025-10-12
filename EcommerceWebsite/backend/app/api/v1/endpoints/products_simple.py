from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db

router = APIRouter()


@router.get("/")
def get_products(db: Session = Depends(get_db)):
    """Simple products endpoint for debugging"""
    try:
        # Test database connection first
        result = db.execute("SELECT 1")
        print("✅ Database connection works")

        # Try to get products with basic query
        from app.models.product import Product
        products = db.query(Product).all()

        print(f"✅ Found {len(products)} products")

        # Convert to simple dicts to avoid Pydantic issues
        simple_products = []
        for product in products:
            simple_products.append({
                "id": product.id,
                "name": product.name,
                "price": float(product.price) if product.price else 0.0,
                "category": product.category,
                "description": product.description,
                "stock_quantity": product.stock_quantity
            })

        return simple_products

    except Exception as e:
        print(f"❌ Error in products endpoint: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Server error: {str(e)}")
