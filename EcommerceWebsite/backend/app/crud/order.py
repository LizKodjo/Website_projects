import random
import string
from app.crud.base import CRUDBase
from app.models.order import Order, OrderItem
from app.schemas.order import OrderCreate, OrderUpdate
from sqlalchemy.orm import Session


def generate_order_number():
    """Generate unique order number"""
    letters = string.ascii_uppercase
    numbers = ''.join(random.choices(string.digits, k=6))
    return f"ORD-{''.join(random.choices(letters, k=3))}{numbers}"

def get_order(db: Session, order_id: int):
    return db.query(Order).filter(Order.id == order_id).first()

def get_orders_by_user(db: Session, user_id: int, skip: int = 0, limit: int = 100):
    return db.query(Order).filter(Order.user_id == user_id).order_by(Order.created_at.desc()).offset(skip).limit(limit).all()

def get_all_orders(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Order).order_by(Order.created_at.desc()).offset(skip).limit(limit).all()

def create_order(db: Session, order: OrderCreate, user_id: int):
    # Generate unique order number
    order_number = generate_order_number()
    
    # Calculate total amount
    total_amount = sum(item.product_price * item.quantity for item in order.items)
    
    # Create order
    db_order = Order(
        user_id=user_id, 
        order_number=order_number, 
        total_amount=total_amount, 
        shipping_address=order.shipping_address, 
        payment_method=order.payment_method, 
        status="confirmed", 
        payment_status='paid'
    )
    
    db.add(db_order)
    db.commit()
    db.refresh(db_order)
    
    # Create order items
    for item in order.items:
        db_item = OrderItem(
            order_id=db_order.id, 
            product_id=item.product_id,
            product_name=item.product_name, 
            product_price=item.product_price,
            quantity=item.quantity
        )
        db.add(db_item)
        
    db.commit()
    db.refresh(db_order)
    return db_order

def update_order_status(db: Session, order_id: int, status: str):
    db_order = get_order(db, order_id)
    if db_order:
        db_order.status = status
        db.commit()
        db.refresh(db_order)
    return db_order