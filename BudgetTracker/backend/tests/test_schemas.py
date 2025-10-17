import pytest
from pydantic import ValidationError
from app import schemas
from datetime import datetime


def test_transaction_create_valid():
    transaction_data = {
        "amount": 100.0,
        "description": "Test transaction",
        "category": "Food",
        "type": "expense"
    }

    transaction = schemas.TransactionCreate(**transaction_data)

    assert transaction.amount == 100.0
    assert transaction.description == "Test transaction"
    assert transaction.category == "Food"
    assert transaction.type == "expense"


def test_transaction_create_invalid_type():
    with pytest.raises(ValidationError):
        schemas.TransactionCreate(
            amount=100.0,
            description="Test",
            category="Food",
            type="invalid_type"  # Should be 'income' or 'expense'
        )


def test_transaction_create_negative_amount():
    with pytest.raises(ValidationError):
        schemas.TransactionCreate(
            amount=-100.0,  # Should be positive
            description="Test",
            category="Food",
            type="expense"
        )


def test_user_create_valid():
    user_data = {
        "email": "test@example.com",
        "password": "password123",
        "full_name": "Test User"
    }

    user = schemas.UserCreate(**user_data)

    assert user.email == "test@example.com"
    assert user.password == "password123"
    assert user.full_name == "Test User"


def test_user_create_invalid_email():
    with pytest.raises(ValidationError):
        schemas.UserCreate(
            email="invalid-email",
            password="password123",
            full_name="Test User"
        )


def test_budget_create_valid():
    budget_data = {
        "category": "Food",
        "amount": 500.0,
        "period": "monthly"
    }

    budget = schemas.BudgetCreate(**budget_data)

    assert budget.category == "Food"
    assert budget.amount == 500.0
    assert budget.period == "monthly"


def test_budget_create_invalid_period():
    with pytest.raises(ValidationError):
        schemas.BudgetCreate(
            category="Food",
            amount=500.0,
            period="invalid_period"  # Should be 'monthly', 'weekly', or 'yearly'
        )
