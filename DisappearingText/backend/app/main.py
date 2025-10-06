import asyncio
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import session
from app.services.timer import monitor_sessions

app = FastAPI()
app.include_router(session.router)

app.add_middleware(CORSMiddleware, allow_origins=[
                   "*"], allow_methods=["*"], allow_headers=["*"],)


@app.on_event("startup")
async def startup_event():
    asyncio.create_task(monitor_sessions())


@app.get("/")
def read_root():
    return {"message": "Write or Vanish backend is runnning!"}
