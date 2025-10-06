import pytest
from httpx import AsyncClient
from app.main import app


@pytest.mark.asyncio
async def test_root():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.get("/")
    assert response.status_code == 200
    assert response.json() == {
        "message": "Write or Vanish backend is running!"}


@pytest.mark.asyncio
async def test_start_session():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.post("/start-session")
    assert response.status_code == 200
    data = response.json()
    assert "session_id" in data
    assert isinstance(data["session_id"], str)


@pytest.mark.asyncio
async def test_keystroke_updates_session():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        # Start session

        start_resp = await ac.post("/start-session")
        session_id = start_resp.json()["session_id"]

        # Send keystroke
        payload = {"session_id": session_id, "text": "Hello world"}
        update_resp = await ac.post("/keystroke", json=payload)

    assert update_resp.status_code == 200
    assert update_resp.json() == {"status": "updated"}


@pytest.mark.asyncio
async def test_get_text_and_save_text():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        # Start session
        start_resp = await ac.post("/start-session")
        session_id = start_resp.json()["session_id"]

        # Save text
        save_payload = {"session_id": session_id, "text": "Final draft"}
        save_resp = await ac.post("/save-text", json=save_payload)
        assert save_resp.status_code == 200
        assert save_resp.json() == {"status": "saved"}

        # Get text
        get_payload = {"session_id": session_id}
        get_resp = await ac.post("/get-text", json=get_payload)
        assert get_resp.status_code == 200
        assert get_resp.json() == {"text": "Final draft"}
