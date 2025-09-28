from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base
from routers import tasks

# Create database tables
Base.metadata.create_all(bind=engine)

# Initialise FastAPI app
app = FastAPI(title="Todo Tasks API")

# Allow frontend access from Vite dev server
origins = ['http://localhost:5173',]

app.add_middleware(CORSMiddleware, allow_origins=origins,
                   allow_credentials=True, allow_methods=['*'], allow_headers=['*'], )

# Include task routes
app.include_router(tasks.router)
