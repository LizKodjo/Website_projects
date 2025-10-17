from sqlalchemy import Column, DateTime, Float, Integer, String
from sqlalchemy.sql import func
from app.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    full_name = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True)
    amount = Column(Float, nullable=False)
    description = Column(String, index=True)
    category = Column(String, index=True)
    type = Column(String)
    date = Column(DateTime(timezone=True), server_default=func.now())
    user_id = Column(Integer, index=True)


class Budget(Base):
    __tablename__ = "budgets"

    id = Column(Integer, primary_key=True, index=True)
    category = Column(String, index=True)
    amount = Column(Float, nullable=False)
    period = Column(String)
    user_id = Column(Integer, index=True)
