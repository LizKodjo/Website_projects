import os
from dotenv import load_dotenv
from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from app.db.database import Base, get_db, engine
from app.core.config import settings


# Load environment variables
load_dotenv()

# Create database tables
Base.metadata.create_all(bind=engine)

# Setup logging
logger = setup_logging()


app = FastAPI(
    title="TaskFlow API",
    description="A comprehensive task management API with full DevOps pipeline.",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc"
)

# CORS middleware
app.add_middleware(CORSMiddleware, allow_origins=settings.CORS_ORIGINS,
                   allow_credentials=True, allow_methods=["*"], allow_headers=["*"])

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
        "health": "/api/health"
    }


@app.get("/api/health")
async def health_check(db: Session = Depends(get_db)):
    """Comprehensive health check"""
    try:
        # Test database connection
        db.execute("SELECT 1")
        return {
            "status": "health",
            "database": "connected",
            "timestamp": "2024*01*01T00:00:00Z"
        }
    except Exception as e:
        logger.error(f"Health check failed: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail="Service unhealthy"
        )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
