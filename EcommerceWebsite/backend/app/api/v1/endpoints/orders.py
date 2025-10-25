from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from app.core.auth import get_current_user
from app.crud import order as order_crud
from app.db.session import get_db
from app.schemas.order import Order, OrderCreate, OrderUpdate
from sqlalchemy.orm import Session

from app.schemas.user import User


router = APIRouter()

@router.get("/", response_model=List[Order])
def get_orders(skip: int= 0, limit: int = 100, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Get orders for current user"""
    if current_user.is_superuser:
        # Admin can see all orders
        orders = order_crud.get_all_orders(db, skip=skip, limit=limit)
    else:
        # Regular users see only their orders
        orders = order_crud.get_orders_by_user(db, current_user.id, skip=skip, limit=limit)
    return orders

@router.get("/{order_id}", response_model=Order)
def get_order(order_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Get specific order"""
    db_order = order_crud.get_order(db, order_id)
    if not db_order:
        raise HTTPException(status_code=404, detail='Order not found')
    
    # Users can only see their own orders unless admin
    if not current_user.is_superuser and db_order.user_id != current_user.id:
        raise HTTPException(status_code=403, detail='Not authorised to view this order.')
    return db_order

@router.post("/", response_model=Order)
def create_order(order: OrderCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Create a new order from cart"""
    return order_crud.create_order(db, order, current_user.id)

@router.put("/{order_id}", response_model=Order)
def update_order(order_id: int, order_update: OrderUpdate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Update order status (admin only)"""
    if not current_user.is_superuser:
        raise HTTPException(status_code=403, detail="Not authorised")
    
    db_order = order_crud.get_order(db, order_id)
    if not db_order:
        raise HTTPException(status_code=404, detail='Order not found.')
    
    if order_update.status:
        db_order = order_crud.update_order_status(db, order_id, order_update.status)
        
    return db_order