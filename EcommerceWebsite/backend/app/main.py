from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from app.api.v1.api import api_router
from app.core.config import settings, PROJECT_NAME, VERSION, API_V1_STR
import time

app = FastAPI(title=PROJECT_NAME, version=VERSION)

# Add debug middleware to see all requests
@app.middleware("http")
async def add_cors_debug_headers(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    
    # Add debug headers to see what's happening
    response.headers["X-Backend-Server"] = "FastAPI"
    response.headers["X-Request-Path"] = request.url.path
    response.headers["X-Request-Method"] = request.method
    response.headers["X-Response-Time"] = str(time.time() - start_time)
    
    print(f"🔧 {request.method} {request.url.path} - Headers: {dict(request.headers)}")
    
    return response

# Comprehensive CORS middleware - MOVE THIS AFTER debug middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow ALL for debugging
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix=API_V1_STR)

@app.get("/")
def read_root():
    return {"message": f"{PROJECT_NAME} is running"}

@app.get("/health")
def health_check():
    return {"status": "healthy", "version": VERSION}

@app.get("/test-cors")
async def test_cors():
    return {"message": "CORS is working!"}

# Add explicit OPTIONS handler for auth register
@app.options("/api/v1/auth/register")
async def options_register():
    return JSONResponse(
        content={"message": "CORS preflight"},
        headers={
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization"
        }
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)