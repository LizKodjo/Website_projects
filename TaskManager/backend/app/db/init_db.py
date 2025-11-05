import logging
from sqlalchemy import text
from .database import engine, Base
from app.models.user import User
from app.models.task import Task

logger = logging.getLogger(__name__)


def init_db():
    """Initialize database tables"""
    try:
        Base.metadata.create_all(bind=engine)
        logger.info("Database tables created successfully")
    except Exception as e:
        logger.error(f"Error creating database tables: {e}")
        raise


if __name__ == "__main__":
    init_db()
