from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1.api import api_router
from app.core.config import settings, PROJECT_NAME, VERSION, API_V1_STR


app = FastAPI(title=PROJECT_NAME, version=VERSION)


# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix=API_V1_STR)


@app.get("/")
def read_root():
    return {"message": f"{PROJECT_NAME} is running."}


@app.get("/health")
def health_check():
    return {"status": "healthy", "version": VERSION}


# if __name__ == "__main__":
#     app.run(debug=True)
