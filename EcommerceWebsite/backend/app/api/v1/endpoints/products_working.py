from fastapi import APIRouter

router = APIRouter()

# Hardcoded products for testing
SAMPLE_PRODUCTS = [
    {
        "id": 1,
        "name": "Wireless Bluetooth Headphones",
        "description": "High-quality wireless headphones with noise cancellation",
        "price": 99.99,
        "category": "electronics",
        "stock_quantity": 50,
        "image_url": "/images/headphones.jpg",
        "is_active": True
    },
    {
        "id": 2,
        "name": "Smartphone",
        "description": "Latest smartphone with advanced camera",
        "price": 699.99,
        "category": "electronics",
        "stock_quantity": 25,
        "image_url": "/images/smartphone.jpg",
        "is_active": True
    },
    {
        "id": 3,
        "name": "Cotton T-Shirt",
        "description": "Comfortable cotton t-shirt in various colors",
        "price": 19.99,
        "category": "clothing",
        "stock_quantity": 100,
        "image_url": "/images/tshirt.jpg",
        "is_active": True
    }
]


@router.get("/")
def get_products():
    """Get all products - hardcoded version"""
    return SAMPLE_PRODUCTS


@router.get("/{product_id}")
def get_product(product_id: int):
    """Get a specific product"""
    product = next((p for p in SAMPLE_PRODUCTS if p["id"] == product_id), None)
    if not product:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Product not found")
    return product


@router.get("/categories/")
def get_categories():
    """Get all categories"""
    categories = list(set(p["category"] for p in SAMPLE_PRODUCTS))
    return {"categories": categories}
