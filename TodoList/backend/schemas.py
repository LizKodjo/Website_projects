from datetime import date
from typing import Optional
from pydantic import BaseModel


class TaskBase(BaseModel):
    title: str
    due_date: Optional[date] = None
    category: Optional[str] = None


class TaskCreate(TaskBase):
    pass


class Task(TaskBase):
    id: int
    completed: bool

    class Config:
        from_attributes = True
