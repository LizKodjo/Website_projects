import os

class Settings:
    def __init__(self):
        self.database_url = os.getenv(
            "DATABASE_URL", 
            "sqlite:///./budget_tracker.db"
        )
        self.secret_key = os.getenv(
            "SECRET_KEY",
            
        )
        self.environment = os.getenv("ENVIRONMENT", "development")
        self.access_token_expire_minutes = int(os.getenv(
            "ACCESS_TOKEN_EXPIRE_MINUTES", 
            "30"
        ))

settings = Settings()