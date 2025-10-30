import pytest


def test_register_user(client):
    user_data = {
        "email": "newuser@example.com",
        "password": "securepassword123",
        "full_name": "New user"
    }

    response = client.post("/api/auth/register", json=user_data)
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == "newuser@example.com"
    assert "id" in data
    assert "hashed_password" not in data


def test_login_success(client, test_user):
    login_data = {
        "username": "test@example.com",
        "password": "testpassword123"
    }

    response = client.post("/api/auth/login", data=login_data)
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"
    assert data["email"] == "test@example.com"


def test_login_wrong_password(client, test_user):
    login_data = {
        "username": "test@example.com",
        "password": "wrongpassword"
    }

    response = client.post("/api/auth/login", data=login_data)
    assert response.status_code == 401


def test_protected_endpint_without_token(client):
    response = client.get(".api/tasks/")
    assert response.status_code == 401


def test_protected_endpoint_with_invalid_token(client):
    headers = {"Authorization": "Bearer invalid_token"}
    response = client.get("/api/tasks/", headers=headers)
    assert response.status_code == 401
