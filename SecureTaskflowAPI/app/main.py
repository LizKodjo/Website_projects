from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer
from sqlalchemy import text
from app.core.config import settings
from app.core.database import engine, Base, get_db
from sqlalchemy.orm import Session

app = FastAPI(
    title="Secure TaskFlow API",
    description="A secure cloud-native task management system",
    version="1.0.0",
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_HOSTS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Security
security = HTTPBearer()


@app.on_event("startup")
async def startup_event():
    try:
        # Test database connection
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        print("✅ Database connection successful")

        # Create tables
        Base.metadata.create_all(bind=engine)
        print("✅ Database tables created")

    except Exception as e:
        print(f"❌ Database connection failed: {e}")


@app.get("/")
async def root():
    return {"message": "Secure TaskFlow API", "version": "1.0.0"}


@app.get("/health")
async def health_check(db: Session = Depends(get_db)):
    try:
        # Test database connection
        db.execute(text("SELECT 1"))
        return {
            "status": "healthy",
            "database": "connected",
            "environment": settings.ENVIRONMENT,
        }
    except Exception as e:
        return {"status": "unhealthy", "database": "disconnected", "error": str(e)}


@app.get("/api/v1/info")
async def api_info():
    return {
        "name": "Secure TaskFlow API",
        "version": "1.0.0",
        "description": "A secure task management system",
        "environment": settings.ENVIRONMENT,
    }


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
