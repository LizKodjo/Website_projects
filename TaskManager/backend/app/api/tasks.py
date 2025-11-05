from datetime import datetime, timezone
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.core.security import verify_token
from app.db.database import get_db
from app.models.task import Task
from app.schemas.task import TaskCreate, TaskResponse, TaskUpdate


router = APIRouter()


def get_current_user_id(token: dict = Depends(verify_token)) -> int:
    return int(token.get("sub"))


@router.post("/", response_model=TaskResponse)
def create_task(task_data: TaskCreate, current_user_id: int = Depends(get_current_user_id), db: Session = Depends(get_db)):
    """Create a new task"""
    task = Task(**task_data.model_dump(), owner_id=current_user_id)

    db.add(task)
    db.commit()
    db.refresh(task)

    return task


@router.get("/", response_model=List[TaskResponse])
def get_tasks(skip: int = Query(0, ge=0), limit: int = Query(100, ge=1, le=1000), status: Optional[str] = Query(None), priority: Optional[str] = Query(None), current_user_id: int = Depends(get_current_user_id), db: Session = Depends(get_db)):
    """Get all tasks for current user with filtering and pagination"""
    query = db.query(Task).filter(
        Task.owner_id == current_user_id, Task.is_deleted == False)

    if status:
        query = query.filter(Task.status == status)
    if priority:
        query = query.filter(Task.priority == priority)

    tasks = query.offset(skip).limit(limit).all()
    return tasks


@router.get("/{task_id}", response_model=TaskResponse)
def get_task(task_id: int, current_user_id: int = Depends(get_current_user_id), db: Session = Depends(get_db)):
    """Get a specific task by ID"""
    task = db.query(Task).filter(Task.id == task_id, Task.owner_id ==
                                 current_user_id, Task.is_deleted == False).first()
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")
    return task


@router.put("/{task_id}", response_model=TaskResponse)
def update_task(task_id: int, task_data: TaskUpdate, current_user_id: int = Depends(get_current_user_id), db: Session = Depends(get_db)):
    """Update a specific task"""
    task = db.query(Task).filter(Task.id == task_id, Task.owner_id ==
                                 current_user_id, Task.is_deleted == False).first()
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")
    update_data = task_data.model_dump(exclude_unset=True)

    for field, value in update_data.items():
        setattr(task, field, value)

    task.updated_at = datetime.now(timezone.utc)

    db.commit()
    db.refresh(task)
    return task


@router.delete("/{task_id}")
def delete_task(
    task_id: int,
    current_user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    """Soft delete a task"""
    task = db.query(Task).filter(
        Task.id == task_id,
        Task.owner_id == current_user_id,
        Task.is_deleted == False
    ).first()

    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    task.is_deleted = True
    task.updated_at = datetime.now(timezone.utc)

    db.commit()

    return {"message": "Task deleted successfully"}


@router.get("/status/stats")
def get_task_stats(
    current_user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    """Get task statistics for current user"""
    stats = db.query(
        Task.status,
        Task.priority,
        db.func.count(Task.id).label('count')
    ).filter(
        Task.owner_id == current_user_id,
        Task.is_deleted == False
    ).group_by(Task.status, Task.priority).all()

    return {
        "stats": [
            {
                "status": stat.status,
                "priority": stat.priority,
                "count": stat.count
            }
            for stat in stats
        ]
    }
