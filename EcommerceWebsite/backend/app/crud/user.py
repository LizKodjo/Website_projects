from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.crud.base import CRUDBase
from app.models.user import User
from app.schemas.user import UserCreate
from app.core.security import get_password_hash, verify_password


class CRUDUser(CRUDBase[User, UserCreate, UserCreate]):
    def get_by_email(self, db: Session, email: str):
        return db.query(self.model).filter(self.model.email == email).first()

    def authenticate(self, db: Session, email: str, password: str):
        user = self.get_by_email(db, email)
        if not user:
            return False
        if not verify_password(password, user.hashed_password):
            return False
        return user

    def create(self, db: Session, *, obj_in: UserCreate):
        # Check if user already exists
        db_user = self.get_by_email(db, email=obj_in.email)
        if db_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )

        # Create user with hashed password
        hashed_password = get_password_hash(obj_in.password)
        db_user = User(
            email=obj_in.email,
            hashed_password=hashed_password,
            full_name=obj_in.full_name,
            is_active=True
        )
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        return db_user


# Create instance
user = CRUDUser(User)
