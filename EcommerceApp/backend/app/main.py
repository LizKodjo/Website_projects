import logging
import os
from fastapi import FastAPI
from app.api.v1 import products, orders
from app.api.v1.auth import router as auth_router
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()


app = FastAPI()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

SECRET_KEY = os.getenv("SECRET_KEY")

app.add_middleware(CORSMiddleware, allow_origins=[
                   "*"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"], )

app.include_router(
    products.router, prefix="/api/v1/products", tags=["products"])
app.include_router(orders.router, prefix="/api/v1/orders", tags=["orders"])
app.include_router(auth_router)
