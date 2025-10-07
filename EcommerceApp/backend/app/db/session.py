import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base, Session


load_dotenv()


DATABASE_URL = os.getenv("DATABASE_URL")
# DATABASE_URL = "sqlite:///./test.db"

connect_args = {"check_same_thread": False}if DATABASE_URL and DATABASE_URL.startswith(
    "sqlite") else {}

engine = create_engine(DATABASE_URL, connect_args=connect_args)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    db: Session = SessionLocal()
    try:
        yield db
    finally:
        db.close()
