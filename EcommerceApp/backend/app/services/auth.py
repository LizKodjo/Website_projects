from fastapi import HTTPException
from fastapi.security import OAuth2PasswordBearer
from app.models.user import User
from app.db.session import SessionLocal
from app.core.security import create_access_token
from passlib.context import CryptContext
import bcrypt
bcrypt.__about__ = bcrypt

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/login")


def register_user(user_data):
    db = SessionLocal()
    hashed_pw = pwd_context.hash(user_data.password)
    user = User(email=user_data.email, hashed_password=hashed_pw)
    db.add(user)
    db.commit()
    db.refresh(user)
    return {"msg": "User created"}


def login_user(user_data):
    db = SessionLocal()
    user = db.query(User).filter(User.email == user_data.email).first()
    if not user or not pwd_context.verify(user_data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = create_access_token({"sub": user.email})
    return {"access_token": token, "token_type": "bearer"}


def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    if len(password.encode("utf-8")) > 72:
        raise ValueError("Password too long for bcrypt (max 72 bytes)")
    return pwd_context.hash(password)
