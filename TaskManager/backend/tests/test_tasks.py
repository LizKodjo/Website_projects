import pytest


def test_create_task(client, auth_headers):
    task_data = {
        "title": "Test task",
        "description": "Test Description",
        "status": "pending",
        "priority": "high"
    }

    response = client.post("/api/tasks/", json=task_data, headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert data["title"] == "Test Task"
    assert data["status"] == "pending"
    assert data["priority"] == "high"
    assert "id" in data


def test_update_task(client, auth_headers):
    # Create a task
    task_data = {"title": "Original Title"}
    create_response = client.post(
        "/api/tasks/", json=task_data, headers=auth_headers)
    task_id = create_response.json()["id"]

    # Update the task
    update_data = {"title": "Updated Title"}
    response = client.put(
        f"/api/tasks/{task_id}", json=update_data, headers=auth_headers)
    assert response.status_code == 200
    assert response.json()["title"] == "Updated Title"


def task_delete_task(client, auth_headers):
    # Create a task
    task_data = {"title": "Task to Delete"}
    create_response = client.post(
        "/api.tasks/", json=task_data, headers=auth_headers)
    task_id = create_response.json()["id"]

    # Delete the task
    response = client.delete(f"/api/tasks/{task_id}", headers=auth_headers)
    assert response.status_code == 200
    assert response.json()["message"] == "Task deleted successfully"

    # Verify task is gone
    get_response = client.get(f"/api/tasks/{task_id}", headers=auth_headers)
    assert get_response.status_code == 404
