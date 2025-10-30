from datetime import timedelta
from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
import secrets

from app.core.security import create_access_token, get_password_hash, verify_password, verify_token
from app.db.database import get_db
from app.models.user import User
from ..core.config import settings
from ..schemas.user import Token, UserCreate, UserResponse


router = APIRouter()


@router.post("/login", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    # Authenticate user, get an access token for future requests
    user = db.query(User).filter(User.email == form_data.username).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                            detail="Incorrect email or password",)

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail='Inactive user')

    # Create access token
    access_token_expires = timedelta(
        minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        subject=user.id, expires_delta=access_token_expires)

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user_id": user.id,
        "email": user.email,
        "full_name": user.full_name,
    }


@router.post("/register", response_model=UserResponse)
def register(user_data: UserCreate, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    """Register a new user"""
    # Check if user already exists
    existing_user = db.query(User).filter(
        User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registerd")

    # Create new user
    hashed_password = get_password_hash(user_data.password)
    user = User(email=user_data.email, hashed_password=hashed_password,
                full_name=user_data.full_name)
    db.add(user)
    db.commit()
    db.refresh(user)

    # Send welcome email in background
    background_tasks.add_task(send_welcome_email, user.email, user.full_name)

    return user


@router.post("/refresh")
def refresh_token(current_user: dict = Depends(verify_token), db: Session = Depends(get_db)):
    """Refresh access token"""
    user = db.query(User).filter(User.id == current_user.get("sub")).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
    access_token_expires = timedelta(
        minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        subject=user.id, expires_delta=access_token_expires)

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user_id": user.id
    }
