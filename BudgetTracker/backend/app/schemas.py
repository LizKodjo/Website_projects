from pydantic import BaseModel, validator
from datetime import datetime
from typing import Optional
from enum import Enum


class TransactionType(str, Enum):
    INCOME = "income"
    EXPENSE = "expense"


class TransactionBase(BaseModel):
    amount: float
    description: str
    category: str
    type: TransactionType  # Use Enum instead of str

    @validator('amount')
    def amount_must_be_positive(cls, v):
        if v <= 0:
            raise ValueError('Amount must be positive')
        return v


class TransactionCreate(TransactionBase):
    pass


class Transaction(TransactionBase):
    id: int
    date: datetime
    user_id: int

    class Config:
        from_attributes = True


class BudgetBase(BaseModel):
    category: str
    amount: float
    period: str

    @validator('amount')
    def amount_must_be_positive(cls, v):
        if v <= 0:
            raise ValueError('Amount must be positive')
        return v


class BudgetCreate(BudgetBase):
    pass


class Budget(BudgetBase):
    id: int
    user_id: int

    class Config:
        from_attributes = True


class UserBase(BaseModel):
    email: str
    full_name: str


class UserCreate(UserBase):
    password: str


class User(UserBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True
