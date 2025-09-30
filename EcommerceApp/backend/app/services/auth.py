from fastapi import HTTPException
from app.models.user import User
from app.db.session import SessionLocal
from app.core.security import create_access_token
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


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
