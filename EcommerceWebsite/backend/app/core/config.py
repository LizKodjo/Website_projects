from pydantic_settings import BaseSettings
import os
from dotenv import load_dotenv

load_dotenv()  # Load environment variables from .env file


class Settings(BaseSettings):

    # Database settings
    # DATABASE_URL: str = "postgresql://user:password@localhost/ecommerce_db"
    DATABASE_URL: str = "sqlite:///./ecommerce.db"  # Example for SQLite

    # JWT settings
    SECRET_KEY: str = os.getenv("SECRET_KEY")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30  # 30 minutes

    class Config:
        case_sensitive = True
        env_file = ".env"


# Create settings instance
settings = Settings()

PROJECT_NAME = "My Ecommerce API"
VERSION = "1.0.0"
API_V1_STR = "/api/v1"
