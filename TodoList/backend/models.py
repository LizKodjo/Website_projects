from sqlalchemy import Column, Integer, Date, String, Boolean
from database import Base


class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    completed = Column(Boolean, default=False)
    due_date = Column(Date, nullable=True)
    category = Column(String, nullable=True)
