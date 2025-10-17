import bcrypt
from sqlalchemy.orm import Session
from app import auth
# from app.auth import get_password_hash
from app.models import Budget, Transaction, User
from app.schemas import BudgetCreate, TransactionCreate, UserCreate


def get_user_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()


def create_user(db: Session, user: UserCreate):
    hashed_password = auth.get_password_hash(user.password)
    db_user = User(email=user.email,
                   hashed_password=hashed_password, full_name=user.full_name)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def create_transaction(db: Session, transaction: TransactionCreate, user_id: int):
    db_transaction = Transaction(**transaction.model_dump(), user_id=user_id)
    db.add(db_transaction)
    db.commit()
    db.refresh(db_transaction)
    return db_transaction


def get_user_transactions(db: Session, user_id: int, skip: int = 0, limit: int = 100):
    return db.query(Transaction).filter(Transaction.user_id == user_id).offset(skip).limit(limit).all()


def create_budget(db: Session, budget: BudgetCreate, user_id: int):
    db_budget = Budget(**budget.model_dump(), user_id=user_id)
    db.add(db_budget)
    db.commit()
    db.refresh(db_budget)
    return db_budget


def get_user_budgets(db: Session, user_id: int):
    return db.query(Budget).filter(Budget.user_id == user_id).all()
