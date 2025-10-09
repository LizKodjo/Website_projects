from app.crud.base import CRUDBase
from app.models.order import Order, OrderItem
from app.schemas.order import OrderCreate
from sqlalchemy.orm import Session


class CRUDOrder(CRUDBase[Order, OrderCreate, OrderCreate]):
    def create_order(self, db: Session, order: OrderCreate):
        # Create order
        db_order = Order(user_id=1, total_amount=order.total_amount,
                         shipping_address=order.shipping_address, status="pending")
        db.add(db_order)
        db.commit()
        db.refresh(db_order)

        # Create order items
        for item in order.items:
            db_item = OrderItem(order_id=db_order.id, product_id=item.product_id,
                                quantity=item.quantity, price=item.price)
            db.add(db_item)

        db.commit()
        db.refresh(db_order)
        return db_order


order = CRUDOrder(Order)
