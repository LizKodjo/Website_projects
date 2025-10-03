from fastapi.testclient import TestClient
from main import app

client = TestClient(app)


def test_create_task():
    response = client.post("/tasks/", json={"title": "Test Task"})
    assert response.status_code == 200
    assert response.json()["title"] == "Test Task"

    # Cleanup
    client.delete(f"/tasks/{response.json()['id']}")


def test_get_tasks():
    response = client.get("/tasks/")
    assert response.status_code == 200
    assert isinstance(response.json(), list)


def test_toggle_complete():
    # Create a task first

    task = client.post("/tasks/", json={"title": "Toggle Me"}).json()
    task_id = task["id"]

    # Toggle completion
    response = client.patch(f"/tasks/{task_id}")
    assert response.status_code == 200
    assert response.json()["completed"] is True
