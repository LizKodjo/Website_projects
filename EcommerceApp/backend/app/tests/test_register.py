from fastapi.testclient import TestClient
import pytest
from app.db.session import SessionLocal
from app.main import app
from app.models.user import User


client = TestClient(app)


@pytest.fixture(autouse=True)
def reset_db():
    db = SessionLocal()
    db.query(User).delete()
    db.commit()
    db.close()


def test_successful_signup():
    response = client.post("/api/v1/signup", json={
        "email": "newuser@example.com",
        "password": "securepass"
    })
    assert response.status_code == 201
    data = response.json()
    assert data["email"] == "newuser@example.com"
    assert "id" in data


def test_duplicate_email_signup():
    # First signup
    client.post("/api/v1/signup",
                json={"email": "duplicate@example.com", "password": "securepass"})

    # Second signup
    response = client.post("/api/v1/signup", json={
        "email": "duplicate@example.com",
        "password": "securepass"
    })
    assert response.status_code == 400
    assert response.json()["detail"] == "Email already registered"


def test_login_after_signup():
    client.post("/api/v1/signup", json={
        "email": "loginuser@example.com",
        "password": "securepass"
    })
    response = client.post("/api/v1/login", json={
        "email": "loginuser@example.com",
        "password": "securepass"
    })
    response = client.post("/api/v1/login", json={
        "email": "loginuser@example.com",
        "password": "securepass"
    })
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"
