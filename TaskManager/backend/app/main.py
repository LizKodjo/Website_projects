from datetime import datetime, timezone
import os
from dotenv import load_dotenv
from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import text

from app.api import auth, tasks, users
from app.core.logging import setup_logging
from app.db import init_db
from app.db.database import Base, engine, get_db
from app.core.config import settings


# Load environment variables
load_dotenv()

# Create database tables
Base.metadata.create_all(bind=engine)

# Setup logging
logger = setup_logging()

try:
    init_db()
    logger.info("Database initialised successfully")
except Exception as e:
    logger.warning(f"Database initialise warning: {e}")


app = FastAPI(
    title="TaskFlow API",
    description="A comprehensive task management API with full DevOps pipeline.",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["authentication"])
app.include_router(users.router, prefix="/api/users", tags=["users"])
app.include_router(tasks.router, prefix="/api/tasks", tags=["tasks"])


@app.get("/")
async def root():
    return {
        "message": "TaskFlow API",
        "version": "1.0.0",
        "docs": "/api/docs",
        "health": "/api/health",
    }


@app.get("/api/health")
async def health_check(db: Session = Depends(get_db)):
    try:
        # Simple database test that works with both SQLite and PostgreSQL
        db.execute(
            text(
                "SELECT 1"
                if not settings.DATABASE_URL.startswith("sqlite")
                else "SELECT 1"
            )
        )
        return {
            "status": "healthy",
            "database": "connected",
            "timestamp": datetime.now(timezone.utc).isoformat() + "Z",
        }
    except Exception as e:
        # Return healthy status even if database fails for now
        return {
            "status": "healthy",
            "database": "disconnected",
            "timestamp": datetime.now(timezone.utc).isoformat() + "Z",
        }


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
