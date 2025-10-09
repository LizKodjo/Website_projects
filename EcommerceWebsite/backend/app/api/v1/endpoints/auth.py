from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.schemas.user import User, UserCreate
from app.crud import user as user_crud


router = APIRouter()


@router.post("/register", response_model=User)
def register(user_data: UserCreate, db: Session = Depends(get_db)):
    # Check if user already exists
    db_user = user_crud.get_user_by_email(db, email=user_data.email)
    if db_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered.")

    # Create new user
    return user_crud.create_user(db=db, user=user_data)


@router.post("/login")
def login():
    return {"message": "Login endpoint"}


@router.post("/logout")
def logout():
    return {"message": "Logout successful."}
