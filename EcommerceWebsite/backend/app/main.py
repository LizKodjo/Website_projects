from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from app.api.v1.api import api_router
from app.core.config import PROJECT_NAME, VERSION, API_V1_STR

app = FastAPI(
    title=PROJECT_NAME,
    version=VERSION,
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS middleware - MOST PERMISSIVE SETTINGS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods
    allow_headers=["*"],  # Allow all headers
)

# Include API router
app.include_router(api_router, prefix=API_V1_STR)

@app.get("/")
async def root():
    return {"message": f"{PROJECT_NAME} is running"}

@app.get("/health")
async def health():
    return {"status": "healthy", "version": VERSION}

# Add explicit OPTIONS handler for all routes
@app.options("/{full_path:path}")
async def options_handler(full_path: str):
    return JSONResponse(
        content={"message": "CORS preflight"},
        headers={
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "*",
            "Access-Control-Allow-Headers": "*",
        }
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="debug"
    )