from app.core.security import get_password_hash
from app.crud.base import CRUDBase
from app.models.user import User
from app.schemas.user import UserCreate
from sqlalchemy.orm import Session


class CRUDUser(CRUDBase[User, UserCreate, UserCreate]):
    def get_user_by_email(self, db: Session, email: str):
        return db.query(self.model).filter(self.model.email == email).first()

    def create_user(self, db: Session, user: UserCreate):
        hashed_password = get_password_hash(user.password)
        db_user = User(email=user.email, hashed_password=hashed_password,
                       name=user.name, is_active=user.is_active)
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        return db_user


user = CRUDUser(User)
