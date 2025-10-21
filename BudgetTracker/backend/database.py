import os
import time
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy.exc import OperationalError

def get_engine_with_retries():
    database_url = os.getenv(
        "DATABASE_URL", 
        "sqlite:///./budget_tracker.db"
    )
    
    # For PostgreSQL, add retry logic
    if database_url.startswith("postgresql"):
        max_retries = 5
        retry_delay = 2
        
        for attempt in range(max_retries):
            try:
                engine = create_engine(
                    database_url,
                    pool_size=10,
                    max_overflow=20,
                    pool_pre_ping=True
                )
                # Test connection
                with engine.connect() as conn:
                    print("✅ Successfully connected to PostgreSQL")
                return engine
            except OperationalError as e:
                print(f"❌ Connection attempt {attempt + 1} failed: {e}")
                if attempt < max_retries - 1:
                    print(f"🔄 Retrying in {retry_delay} seconds...")
                    time.sleep(retry_delay)
                else:
                    print("💥 All connection attempts failed")
                    raise
    else:
        # SQLite fallback
        return create_engine(
            database_url,
            connect_args={"check_same_thread": False}
        )

# Create engine with retry logic
engine = get_engine_with_retries()
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()