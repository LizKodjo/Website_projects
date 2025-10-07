from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.security import get_current_user
from app.db.session import get_db
from app.models.order import Order, OrderItem
from app.schemas.order import OrderCreate, OrderOut

router = APIRouter()


@router.post("/", response_model=OrderOut)
def create_order(order: OrderCreate, db: Session = Depends(get_db), user=Depends(get_current_user)):

    db_order = Order(user_id=user.id, total=order.total, status="pending")
    db.add(db_order)
    db.commit()
    db.refresh(db_order)

    for item in order.items:
        db_item = OrderItem(order_id=db_order.id,
                            product_id=item.product_id, quantity=item.quantity)
        db.add(db_item)
        db.commit()

        db.refresh(db_order)

    return db_order


@router.get("/", response_model=list[OrderOut])
def list_orders(db: Session = Depends(get_db)):
    return db.query(Order).all()


@router.get("/all", response_model=list[OrderOut])
def get_all_orders(db: Session = Depends(get_db), user=Depends(get_current_user)):
    if user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    return db.query(Order).order_by(Order.created_at.desc()).all()


@router.get("/my", response_model=list[OrderOut])
def get_user_orders(db: Session = Depends(get_db), user=Depends(get_current_user)):
    return db.query(Order).filter(Order.user_id == user.id).order_by(Order.created_at.desc()).all()


@router.put("/{order_id}/status")
def update_order_status(order_id: int, status: str, db: Session = Depends(get_db), user=Depends(get_current_user)):
    if user.role != "admin":
        raise HTTPException(status_code=403)
    order = db.query(Order).get(order_id)
    order.status = status
    db.commit()
    return {"message": "Order status updated"}
