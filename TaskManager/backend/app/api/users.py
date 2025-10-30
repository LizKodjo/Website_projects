from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.security import get_password_hash, verify_token
from app.db.database import get_db
from app.models.user import User
from app.schemas.user import UserResponse, UserUpdate


router = APIRouter()


@router.get("/me", response_model=UserResponse)
def get_current_user(current_user: dict = Depends(verify_token), db: Session = Depends(get_db)):
    """Get current user information"""
    user = db.query(User).filter(User.id == current_user.get("sub")).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return user


@router.put("/me", response_model=UserResponse)
def update_current_user(user_data: UserUpdate, current_user: dict = Depends(verify_token), db: Session = Depends(get_db)):
    """Update current user information"""
    user = db.query(User).filter(User.id == current_user.get("sub")).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    update_data = user_data.dict(exclude_unset=True)

    if "password" in update_data:
        update_data["hashed_password"] = get_password_hash(
            update_data.pop("password"))

    for field, value in update_data.items():
        setattr(user, field, value)

    db.commit()
    db.refresh(user)

    return user


@router.delete("/me")
def delete_current_user(current_user: dict = Depends(verify_token), db: Session = Depends(get_current_user)):
    """Delete current user (soft delete)"""
    user = db.query(User).filter(
        User.id == current_user.get("sub")).first()
    if not user:
        raise HTTPException(
            status_code=status.HTtP_404_NOT_FOUND, detail="User not found")

    user.is_active = False
    db.commit()
    return {"message": "User deleted successfully"}
