from typing import List
from fastapi import APIRouter, Depends, HTTPException
from app.crud import order as order_crud
from app.db.session import get_db
from app.schemas.order import Order, OrderCreate
from sqlalchemy.orm import Session


router = APIRouter()


@router.get("/", response_model=List[Order])
def get_orders(db: Session = Depends(get_db)):
    """Get all orders"""
    return order_crud.get_multi(db)


@router.post("/", response_model=Order)
def create_order(order: OrderCreate, db: Session = Depends(get_db)):
    """Create a new order"""
    return order_crud.create_order(db, order)


@router.get("/{order_id}", response_model=Order)
def get_order(order_id: int, db: Session = Depends(get_db)):
    """Get a specific order by ID"""
    order = order_crud.get(db, order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order
