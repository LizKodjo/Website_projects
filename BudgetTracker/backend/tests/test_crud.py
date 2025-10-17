import pytest
from app import crud, models, schemas
import bcrypt


def test_create_user(db_session):
    user_data = schemas.UserCreate(
        email="newuser@example.com",
        password="password123",
        full_name="New User"
    )

    user = crud.create_user(db_session, user_data)

    assert user.email == "newuser@example.com"
    assert user.full_name == "New User"
    assert hasattr(user, 'hashed_password')
    assert user.hashed_password != "password123"  # Password should be hashed


def test_get_user_by_email(db_session, test_user):
    user = crud.get_user_by_email(db_session, test_user.email)

    assert user is not None
    assert user.email == test_user.email
    assert user.full_name == test_user.full_name


def test_create_transaction(db_session, test_user):
    transaction_data = schemas.TransactionCreate(
        amount=150.0,
        description="Test transaction",
        category="Entertainment",
        type="expense"
    )

    transaction = crud.create_transaction(
        db_session, transaction_data, test_user.id)

    assert transaction.amount == 150.0
    assert transaction.description == "Test transaction"
    assert transaction.category == "Entertainment"
    assert transaction.type == "expense"
    assert transaction.user_id == test_user.id


def test_get_user_transactions(db_session, test_user, test_transaction):
    transactions = crud.get_user_transactions(db_session, test_user.id)

    assert len(transactions) == 1
    assert transactions[0].id == test_transaction.id
    assert transactions[0].user_id == test_user.id


def test_create_budget(db_session, test_user):
    budget_data = schemas.BudgetCreate(
        category="Transportation",
        amount=200.0,
        period="monthly"
    )

    budget = crud.create_budget(db_session, budget_data, test_user.id)

    assert budget.category == "Transportation"
    assert budget.amount == 200.0
    assert budget.period == "monthly"
    assert budget.user_id == test_user.id


def test_get_user_budgets(db_session, test_user, test_budget):
    budgets = crud.get_user_budgets(db_session, test_user.id)

    assert len(budgets) == 1
    assert budgets[0].id == test_budget.id
    assert budgets[0].user_id == test_user.id
