from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.session import get_db


router = APIRouter()


@router.get("/")
def get_users(db: Session = Depends(get_db)):
    return {"message": "Get users endpoint"}


@router.get("/{user_id}")
def get_user(user_id: int, db: Session = Depends(get_db)):
    return {"message": f"Get user {user_id}"}
