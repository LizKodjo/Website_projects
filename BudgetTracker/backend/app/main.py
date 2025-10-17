from datetime import timedelta
from fastapi import Body, FastAPI, Depends, HTTPException, Query, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from typing import List
import uvicorn
from pydantic import ValidationError

from app import models
from app import auth
from app.auth import ACCESS_TOKEN_EXPIRE_MINUTES, authenticate_user, create_access_token, get_current_user
from app.database import get_db, engine
from app.models import Base
import app.schemas as schemas
import app.crud as crud

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Budget Tracker API",
    description="A comprehensive personal finance management system",
    version="1.0.0"
)

# Enhanced CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:5173",  # Vite default port
        "http://localhost:8001",  # Backend port
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:8001",
    ],
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods
    allow_headers=["*"],  # Allow all headers
)


@app.get("/")
async def read_root():
    return {
        "message": "Welcome to Budget Tracker API",
        "version": "1.0.0",
        "status": "running",
        "endpoints": {
            "docs": "/docs",
            "health": "/health",
            "users": "/users/",
            "transactions": "/transactions/",
            "budgets": "/budgets/"
        }
    }


@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "budget-tracker-api"}


@app.post("/users/", response_model=schemas.User)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    return crud.create_user(db=db, user=user)


@app.post("/transactions/", response_model=schemas.Transaction)
def create_transaction(
    transaction: schemas.TransactionCreate = Body(..., embed=True),
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    try:
        print(
            f"📝 Creating transaction for user {current_user.id}")
        result = crud.create_transaction(
            db=db, transaction=transaction, user_id=current_user)
        print(f"✅ Transaction created successfully: {result.id}")
        return result
    except Exception as e:
        print(f"❌ Error creating transaction: {str(e)}")
        raise HTTPException(
            status_code=500, detail=f"Failed to create transaction: {str(e)}")


@app.get("/transactions/", response_model=List[schemas.Transaction])
def read_transactions(
    # user_id: int = Query(...),  # Keep as query for GET
    current_user: models.User = Depends(get_current_user),
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    transactions = crud.get_user_transactions(
        db, user_id=current_user, skip=skip, limit=limit)
    return transactions


@app.post("/budgets/", response_model=schemas.Budget)
def create_budget(
    budget: schemas.BudgetCreate = Body(..., embed=True),
    # user_id: int = Body(..., embed=True),
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    try:
        print(f"📝 Creating budget: {budget.dict()} for user {current_user}")
        result = crud.create_budget(db=db, budget=budget, user_id=current_user)
        print(f"✅ Budget created successfully: {result.id}")
        return result
    except Exception as e:
        print(f"❌ Error creating budget: {str(e)}")
        raise HTTPException(
            status_code=500, detail=f"Failed to create budget: {str(e)}")


@app.get("/budgets/", response_model=List[schemas.Budget])
def read_budgets(
    # user_id: int = Query(...),  # Keep as query for GET
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return crud.get_user_budgets(db, user_id=current_user)


@app.post("/token")
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = auth.authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                            detail="Incorrect email or password", headers={"WWW-Authenticate": "Bearer"})
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": str(user.id)}, expires_delta=access_token_expires)

    return {"access_token": access_token, "token_type": "bearer", "user_id": user.id, "email": user.email, "full_name": user.fullname}


@app.post("/register", response_model=schemas.User)
def register_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    return crud.create_user(db=db, user=user)


# Add this to run the server directly
if __name__ == "__main__":
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",  # Changed from 127.0.0.1 to 0.0.0.0 for external access
        port=8000,
        reload=True,
        access_log=True
    )
