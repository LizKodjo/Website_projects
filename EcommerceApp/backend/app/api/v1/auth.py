from fastapi import APIRouter, Depends, HTTPException
from app.schemas.user import UserCreate, UserLogin
from app.services.auth import register_user, login_user

router = APIRouter()


@router.post("/signup")
def signup(user: UserCreate):
    return register_user(user)


@router.post("/login")
def login(user: UserLogin):
    return login_user(user)
