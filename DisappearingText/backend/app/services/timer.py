import asyncio
from datetime import datetime, timedelta
from app.routes.session import session_store

INACTIVITY_TIMEOUT = timedelta(seconds=5)


async def monitor_sessions():
    while True:
        now = datetime.now()
        for session_id, data in session_store.items():
            if now - data["last_activity"] > INACTIVITY_TIMEOUT:
                data["text"] = ""  # vanish!
        await asyncio.sleep(1)
