from fastapi import APIRouter, HTTPException
from uuid import uuid4
from datetime import datetime

from pydantic import BaseModel

router = APIRouter()

# In-memory session store
session_store = {}


class KeystrokePayload(BaseModel):
    session_id: str
    text: str


class SessionPayload(BaseModel):
    session_id: str


@router.post("/get-text")
def get_text(payload: SessionPayload):
    session = session_store.get(payload.session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found.")
    return {"text": session["text"]}


class SavePayLoad(BaseModel):
    session_id: str
    text: str


@router.post("/save-text")
def save_text(payload: SavePayLoad):
    # Simulate saving (could write to file/db later)
    session = session_store.get(payload.session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found.")
    session["text"] = payload.text
    return {"status": "saved"}


@router.post("/keystroke")
def register_keystroke(payload: KeystrokePayload):
    session = session_store.get(payload.session_id)
    if not session:
        raise HTTPException(status_code=403, detail="Session not found.")

    session["text"] = payload.text
    session["last_activity"] = datetime.now()
    return {"status": "updated"}


@router.post("/start-session")
def start_session():
    session_id = str(uuid4())
    session_store[session_id] = {
        "text": "",
        "last_activity": datetime.now()
    }
    return {"session_id": session_id}
