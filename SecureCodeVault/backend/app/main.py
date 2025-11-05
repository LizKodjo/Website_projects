from datetime import datetime, timezone
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import text
from typing import List

from . import models, schemas, crud, auth
from .database import SessionLocal, engine, get_db
from .config import settings
from .encryption import encryption_service

try:
    settings.validate()
    print("✅ All environment variables are properly configured")
except ValueError as e:
    print(f"❌ Configuration error: {e}")

# Create database tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title='SecureCode Vault API',
              description='A secure platform for code snippet management', version='1.0.0')

# CORS middleware
app.add_middleware(
    CORSMiddleware, allow_origins=[
        "http://localhost:3000", "http://frontend:3000", ],
    allow_credentials=True, allow_methods=["*"], allow_headers=["*"],
)


@app.get('/')
async def root():
    return {"message": "Welcome to SecureCode Vault API"}


@app.get("/health")
async def health_check():
    """Enhanced health check that verifies all services"""
    try:
        # Test database connection
        db = SessionLocal()
        db.execute(text("SELECT 1"))
        db.close()

        # Test encryption service
        test_data = "health_check"
        encrypted = encryption_service.encrypt(test_data)
        decrypted = encryption_service.decrypt(encrypted)

        if decrypted != test_data:
            raise Exception("Encryption service test failed")

        return {
            "status": "healthy",
            "database": "connected",
            "encryption": "working",
            "timestamp": datetime.now(timezone.utc).isoformat()
        }
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Service unhealthy: {str(e)}")


@app.get("/test/encryption")
async def test_encryption():
    """Test endpoint to verify encryption is working"""
    try:
        test_data = "Hello, SecureCode Vault"
        encrypted = encryption_service.encrypt(test_data)
        decrypted = encryption_service.decrypt(encrypted)

        return {
            "original": test_data,
            "encrypted": encrypted,
            "decrypted": decrypted,
            "success": decrypted == test_data
        }
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Encryption test failed: {str(e)}")

# Authenticate endpoints


@app.post("/auth/register", response_model=schemas.UserResponse)
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registerd")

    return crud.create_user(db=db, user=user)


@app.post('/auth/login', response_model=schemas.Token)
def login(user_data: schemas.UserLogin, db: Session = Depends(get_db)):
    user = auth.authenticate_user(db, user_data.email, user_data.password)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                            detail="Incorrect email or password", headers={"WWW-Authenticate": "Bearer"},)
    access_token = auth.create_access_token(data={"sub": str(user.id)})
    return {"access_token": access_token, "token_type": "bearer"}


# Protected endpoints
@app.post("/snippets", response_model=schemas.SnippetResponse)
def create_snippet(snippet: schemas.SnippetCreate, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    return crud.create_snippet(db=db, snippet=snippet, user_id=current_user.id, encryption_service=encryption_service)


@app.get('/snippets', response_model=List[schemas.SnippetResponse])
def get_my_snippets(db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    snippets = crud.get_user_snippets(db, user_id=current_user.id)
    return snippets


@app.get('/users/me', response_model=schemas.UserResponse)
def read_users_me(current_user: models.User = Depends(auth.get_current_user)):
    return current_user
