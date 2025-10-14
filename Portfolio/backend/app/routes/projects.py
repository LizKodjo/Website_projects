from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from app.models import engine, Project


router = APIRouter(prefix="/projects", tags=["projects"])


def get_session():
    with Session(engine) as session:
        yield session


@router.get("/", response_model=List[Project])
async def get_projects(featured: Optional[bool] = None, category: Optional[str] = None, session: Session = Depends(get_session)):
    statement = select(Project)

    if featured is not None:
        statement = statement.where(Project.featured == featured)

    if category:
        statement = statement.where(Project.category == category)

    statement = statement.order_by(
        Project.featured.desc(), Project.created_at.desc())

    projects = session.exec(statement).all()
    return projects


@router.get("/{project_id}", response_model=Project)
async def get_project(project_id: int, session: Session = Depends(get_session)):
    project = session.get(Project, project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project


@router.get("/categories/all")
async def get_categories(session: Session = Depends(get_session)):
    statement = select(Project.category).distinct()
    categories = session.exec(statement).all()
    return {"categories": categories}
