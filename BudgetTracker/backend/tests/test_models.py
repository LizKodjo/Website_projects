from datetime import datetime
from app.models import Budget, Transaction, User


def test_user_model():
    user = User(email="test@example.com",
                hashed_password="hashed_password", full_name="Test User")

    assert user.email == 'test@example.com'
    assert user.hashed_password == 'hashed_password'
    assert user.full_name == 'Test User'
    assert isinstance(user.created_at, datetime)


def test_transaction_model():
    transaction = Transaction(
        amount=100.0, description="Test transaction", category="Food", type="expense", user_id=1)
    assert transaction.amount == 100.0
    assert transaction.description == "Test transaction"
    assert transaction.category == "Food"
    assert transaction.type == "expense"
    assert transaction.user_id == 1
    assert isinstance(transaction.date, datetime)


def test_budget_model():
    budget = Budget(category="Food", amount=500.0, period="monthly", user_id=1)
    assert budget.category == "Food"
    assert budget.amount == 500.0
    assert budget.period == "monthly"
    assert budget.user_id == 1
