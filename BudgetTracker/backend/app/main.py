from fastapi import FastAPI, Depends, HTTPException, Body, Query, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from typing import List
import uvicorn
from datetime import timedelta

from app.database import get_db, engine
from app.models import Base
import app.schemas as schemas
import app.crud as crud
from app.auth import authenticate_user, create_access_token, get_current_user, ACCESS_TOKEN_EXPIRE_MINUTES

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
        "http://localhost:5173",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173",
        "http://localhost:8001",
        "http://127.0.0.1:8001",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Manual CORS fallback


@app.middleware("http")
async def add_cors_headers(request, call_next):
    response = await call_next(request)
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"
    response.headers["Access-Control-Allow-Headers"] = "*"
    return response


@app.options("/{rest_of_path:path}")
async def preflight_handler(request, rest_of_path: str):
    return {"status": "ok"}

# Your existing routes here...


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


@app.post("/token")
async def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    user = authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )
    access_token_expires = timedelta(minutes=int(ACCESS_TOKEN_EXPIRE_MINUTES))
    access_token = create_access_token(
        data={"sub": str(user.id)}, expires_delta=access_token_expires
    )
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user_id": user.id,
        "email": user.email,
        "full_name": user.full_name
    }


@app.post("/register", response_model=schemas.User)
def register_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    return crud.create_user(db=db, user=user)

# Your transaction and budget endpoints...


@app.post("/transactions/", response_model=schemas.Transaction)
def create_transaction(
    transaction: schemas.TransactionCreate = Body(..., embed=True),
    user_id: int = Body(..., embed=True),
    db: Session = Depends(get_db)
):
    try:
        print(
            f"📝 Creating transaction: {transaction.dict()} for user {user_id}")
        result = crud.create_transaction(
            db=db, transaction=transaction, user_id=user_id)
        print(f"✅ Transaction created successfully: {result.id}")
        return result
    except Exception as e:
        print(f"❌ Error creating transaction: {str(e)}")
        raise HTTPException(
            status_code=500, detail=f"Failed to create transaction: {str(e)}")


@app.get("/transactions/", response_model=List[schemas.Transaction])
def read_transactions(
    user_id: int = Query(...),
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    transactions = crud.get_user_transactions(
        db, user_id=user_id, skip=skip, limit=limit)
    return transactions


@app.post("/budgets/", response_model=schemas.Budget)
def create_budget(
    budget: schemas.BudgetCreate = Body(..., embed=True),
    user_id: int = Body(..., embed=True),
    db: Session = Depends(get_db)
):
    try:
        print(f"📝 Creating budget: {budget.dict()} for user {user_id}")
        result = crud.create_budget(db=db, budget=budget, user_id=user_id)
        print(f"✅ Budget created successfully: {result.id}")
        return result
    except Exception as e:
        print(f"❌ Error creating budget: {str(e)}")
        raise HTTPException(
            status_code=500, detail=f"Failed to create budget: {str(e)}")


@app.get("/budgets/", response_model=List[schemas.Budget])
def read_budgets(
    user_id: int = Query(...),
    db: Session = Depends(get_db)
):
    return crud.get_user_budgets(db, user_id=user_id)


if __name__ == "__main__":
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8001,
        reload=True
    )
