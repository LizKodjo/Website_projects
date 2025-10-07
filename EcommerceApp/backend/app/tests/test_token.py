from fastapi.testclient import TestClient
import pytest
from app.main import app
from app.tests.test_utils import seed_admin_user


client = TestClient(app)


@pytest.fixture(autouse=True)
def setup_admin():
    seed_admin_user()


def test_access_me_with_valid_token():
    login = client.post("/api/v1/login", json={
        "email": "admin@example.com",
        "password": "test"
    })
    token = login.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    response = client.get("/api/v1/me", headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == "admin@example.com"
    assert data["role"] == "admin"


def test_access_me_with_invalid_token():
    headers = {"Authorization": "Bearer invalidtoken123"}
    response = client.get("api/v1/me", headers=headers)
    assert response.status_code == 401
    assert response.json()["detail"] == "Token decode error"


def test_access_me_with_missing_token():
    response = client.get("/api/v1/me")
    assert response.status_code == 401
    assert response.json()["detail"] == "Not authenticated"
