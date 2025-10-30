from fastapi.testclient import TestClient
import pytest
from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine
from sqlalchemy.pool import StaticPool

from app.db.database import Base, get_db

from app.main import app

# Test database
SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"

engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={
                       "check_same_thread": False}, poolclass=StaticPool,)
TestingSessionLocal = sessionmaker(
    autocommit=False, autoflush=False, bind=engine)


def override_get_db():
    try:
        db = TestingSessionLocal()
        yield
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db


@pytest.fixture(scope="function")
def test_db():
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)


@pytest.fixture(scope="function")
def client(test_db):
    with TestClient(app) as test_client:
        yield test_client


@pytest.fixture(scope="function")
def test_user(client):
    user_data = {
        "email": "test@example.com",
        "password": "testpassword123",
        "full_name": "Test User"
    }

    response = client.post("/api/auth/register", json=user_data)
    assert response.status_code == 200
    return response.json()


@pytest.fixture(scope="function")
def auth_headers(client, test_user):
    login_data = {
        "username": "test@example.com",
        "password": "testpassword123"
    }

    response = client.post("/api/auth/login", data=login_data)
    assert response.status_code == 200
    token = response.json()["access_token"]

    return {"Authorization": f"Bearer {token}"}
