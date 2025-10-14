from fastapi.testclient import TestClient
import pytest
from app.main import app


client = TestClient(app)


def test_root_endpoints():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json()["message"] == "EK Portfolio API"


def test_get_projects():
    response = client.get("/projects")
    assert response.status_code == 200
    assert isinstance(response.json(), list)
    assert len(response.json()) > 0


def test_get_featured_projects():
    response = client.get("/projects?featured=true")
    assert response.status_code == 200
    projects = response.json()
    assert all(project["featured"] for project in projects)


def test_get_single_project():
    response = client.get("/projects/1")
    assert response.status_code == 200
    assert response.json()["id"] == 1


def test_project_not_found():
    response = client.get("/projects/999")
    assert response.status_code == 404


def test_contact_endpoint():
    contact_data = {
        "name": "Test User",
        "email": "test@example.com",
        "message": "This is a test message"
    }
    response = client.post("/contact", json=contact_data)
    assert response.status_code == 200
    assert response.json()["status"] == "success"
