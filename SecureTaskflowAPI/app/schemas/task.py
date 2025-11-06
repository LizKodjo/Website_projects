from datetime import datetime
from enum import Enum
from typing import Optional

from pydantic import BaseModel, validator


class TaskPriority(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"


class TaskStatus(str, Enum):
    PENDING = "pending"
    IN_PROGESS = "in_progress"
    COMPLETED = "completed"


class TaskBase(BaseModel):
    title: str
    description: Optional[str] = None
    priority: TaskPriority = TaskPriority.MEDIUM
    status: TaskStatus = TaskStatus.PENDING
    due_date: Optional[datetime] = None

    @validator("title")
    def title_must_not_be_empty(cls, v):
        if not v or not v.strip():
            raise ValueError("Title cannot be empty")
        return v.strip()


class TaskCreate(TaskBase):
    pass


class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    priority: Optional[TaskPriority] = None
    status: Optional[TaskStatus] = None
    due_date: Optional[datetime] = None


class TaskResponse(TaskBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
