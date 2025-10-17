import pytest
from fastapi import status


def test_create_user(client):
    user_data = {
        "email": "new@example.com",
        "password": "password123",
        "full_name": "New User"
    }

    response = client.post("/users/", json=user_data)

    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["email"] == user_data["email"]
    assert data["full_name"] == user_data["full_name"]
    assert "id" in data
    assert "created_at" in data


def test_create_user_duplicate_email(client, test_user):
    user_data = {
        "email": test_user.email,
        "password": "password123",
        "full_name": "Another User"
    }

    response = client.post("/users/", json=user_data)

    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert "Email already registered" in response.json()["detail"]


def test_create_transaction(client, test_user):
    transaction_data = {
        "amount": 75.50,
        "description": "API test transaction",
        "category": "Shopping",
        "type": "expense"
    }

    response = client.post(
        f"/transactions/?user_id={test_user.id}", json=transaction_data)

    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["amount"] == transaction_data["amount"]
    assert data["description"] == transaction_data["description"]
    assert data["user_id"] == test_user.id


def test_get_transactions(client, test_user, test_transaction):
    response = client.get(f"/transactions/?user_id={test_user.id}")

    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert len(data) == 1
    assert data[0]["id"] == test_transaction.id
    assert data[0]["user_id"] == test_user.id


def test_create_budget(client, test_user):
    budget_data = {
        "category": "Utilities",
        "amount": 150.0,
        "period": "monthly"
    }

    response = client.post(
        f"/budgets/?user_id={test_user.id}", json=budget_data)

    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["category"] == budget_data["category"]
    assert data["amount"] == budget_data["amount"]
    assert data["user_id"] == test_user.id


def test_get_budgets(client, test_user, test_budget):
    response = client.get(f"/budgets/?user_id={test_user.id}")

    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert len(data) == 1
    assert data[0]["id"] == test_budget.id
    assert data[0]["user_id"] == test_user.id


def test_root_endpoint(client):
    response = client.get("/")

    assert response.status_code == status.HTTP_200_OK
    assert response.json() == {"message": "Budget Tracker API"}
