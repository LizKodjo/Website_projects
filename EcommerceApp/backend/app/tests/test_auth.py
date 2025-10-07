from fastapi.testclient import TestClient
import pytest
from app.main import app
from app.tests.test_utils import seed_admin_user

client = TestClient(app)


@pytest.fixture(autouse=True)
def setup_admin():
    seed_admin_user()


def test_login_success():
    response = client.post(
        "/api/v1/login", json={"email": "admin@example.com", "password": "test"})
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"


def test_login_invalid_password():
    response = client.post(
        "/api/v1/login", json={"email": "admin@example.com", "password": "wrongpass"})
    assert response.status_code == 401
    assert response.json()["detail"] == "Invalid credentials"


def test_login_nonexistent_user():
    response = client.post(
        "/api/v1/login", json={"email": "ghost@example.com", "password": "test"})
    assert response.status_code == 401
    assert response.json()["detail"] == "Invalid credentials"
