from sqlmodel import SQLModel, Field, create_engine, Session, select
from typing import Optional, List
from datetime import datetime
import json


class ProjectBase(SQLModel):
    title: str
    description: str
    # Make it optional for backward compatibility
    long_description: Optional[str] = None
    technologies: str
    github_url: Optional[str] = None
    live_url: Optional[str] = None
    image_url: Optional[str] = None
    featured: bool = False
    category: str = "web"


class Project(ProjectBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    created_at: datetime = Field(
        default_factory=datetime.utcnow)


class ProjectRead(ProjectBase):
    id: int
    created_at: datetime


# Database setup
sqlite_url = "sqlite:///./portfolio.db"
engine = create_engine(sqlite_url, echo=True)


def create_db_and_tables():
    SQLModel.metadata.create_all(engine)
