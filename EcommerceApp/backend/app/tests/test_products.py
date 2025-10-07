import pytest
from fastapi.testclient import TestClient
from app.core.security import create_access_token
from app.db.session import SessionLocal
from app.main import app
from app.models.user import User
from app.services.auth import get_password_hash
from app.db.session import Base, engine
from app.tests.test_utils import seed_admin_user
# from app.tests.test_products import seed_admin_user

client = TestClient(app)


@pytest.fixture(scope="session", autouse=True)
def setup_database():
    Base.metadata.create_all(bind=engine)
    # seed_admin_user()


def get_auth_header():
    token = create_access_token(
        data={"sub": "admin@example.com", "role": "admin"})
    return {"Authorization": f"Bearer {token}"}


def test_create_product():
    seed_admin_user()
    headers = get_auth_header()
    response = client.post(
        "/api/v1/products/create", json={"name": "Test Product", "price": 19.99, "image_url": "testingimages", "category": "food", "description": "Testing"}, headers=headers)
    assert response.status_code == 200
    assert response.json()["name"] == "Test Product"


def test_invalid_price():
    seed_admin_user()
    headers = get_auth_header()
    response = client.post(
        "/api/v1/products/create", json={"name": "Bad Product", "price": -5, "image_url": "testingimages", "category": "food", "description": "Testing"}, headers=headers)
    assert response.status_code == 422
