from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import Session, select, text
from typing import List
import json
import os

from .models import Project, ProjectRead, engine, create_db_and_tables

app = FastAPI(
    title="EK Portfolio API",
    description="Backend for EK's portfolio website",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000",
                   "http://127.0.0.1:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency for database session


def get_session():
    with Session(engine) as session:
        yield session


@app.on_event("startup")
def on_startup():
    # Remove old database if it exists to ensure clean start
    if os.path.exists("portfolio.db"):
        os.remove("portfolio.db")
        print("🗑️  Removed old database for clean start")

    create_db_and_tables()
    seed_sample_data()


def seed_sample_data():
    """Seed sample projects if database is empty"""
    with Session(engine) as session:
        # Check if projects already exist
        existing_projects = session.exec(select(Project)).first()
        if existing_projects:
            print("✅ Database already has data, skipping seed")
            return

        sample_projects = [
            Project(
                title="E-Commerce Platform",
                description="Full-stack e-commerce solution with modern tech stack",
                long_description="A complete e-commerce platform featuring user authentication, product management, shopping cart, payment integration, and admin dashboard. Built with microservices architecture and deployed using Docker.",
                technologies=json.dumps(
                    ["Python", "FastAPI", "React", "PostgreSQL", "Docker", "Redis", "Stripe API"]),
                github_url="https://github.com/ek/ecommerce-platform",
                live_url="https://ecommerce-demo.ek.com",
                featured=True,
                category="web"
            ),
            Project(
                title="Data Visualization Dashboard",
                description="Real-time analytics dashboard with interactive charts",
                long_description="A comprehensive data visualization tool that processes large datasets and presents them through interactive charts and graphs. Features real-time updates, filtering, and export capabilities.",
                technologies=json.dumps(
                    ["Python", "FastAPI", "D3.js", "MongoDB", "WebSockets"]),
                github_url="https://github.com/ek/data-dashboard",
                live_url="https://dashboard.ek.com",
                featured=True,
                category="data-science"
            ),
            Project(
                title="Task Management App",
                description="Collaborative task management with real-time updates",
                long_description="A Kanban-style task management application with real-time collaboration features, file attachments, comments, and progress tracking. Implements WebSocket for live updates.",
                technologies=json.dumps(
                    ["React", "Node.js", "Socket.io", "MongoDB", "Express"]),
                github_url="https://github.com/ek/task-manager",
                featured=False,
                category="web"
            ),
            Project(
                title="Machine Learning API",
                description="REST API for machine learning model predictions",
                long_description="A scalable ML API service that serves predictions from trained models. Includes model versioning, request batching, and comprehensive monitoring with Prometheus and Grafana.",
                technologies=json.dumps(
                    ["Python", "FastAPI", "Scikit-learn", "Docker", "Kubernetes", "Prometheus"]),
                github_url="https://github.com/ek/ml-api",
                featured=True,
                category="data-science"
            ),
            Project(
                title="Portfolio Website",
                description="This very portfolio website showcasing my projects",
                long_description="A responsive portfolio website built with React, FastAPI, and SCSS. Features a dark theme with reddish-gold accents, project filtering, and a contact form. Demonstrates full-stack development skills.",
                technologies=json.dumps(
                    ["Python", "FastAPI", "React", "SCSS", "SQLite", "SQLModel"]),
                github_url="https://github.com/ek/portfolio",
                live_url="https://ek-portfolio.com",
                featured=True,
                category="web"
            )
        ]

        for project in sample_projects:
            session.add(project)
        session.commit()
        print("✅ Sample projects seeded successfully!")
        print(f"📊 Added {len(sample_projects)} projects to the database")


@app.get("/")
async def root():
    return {"message": "EK Portfolio API", "status": "healthy"}


@app.get("/projects", response_model=List[ProjectRead])
async def get_projects(
    featured: bool = None,
    session: Session = Depends(get_session)
):
    try:
        query = select(Project)

        if featured is not None:
            query = query.where(Project.featured == featured)

        query = query.order_by(Project.featured.desc(),
                               Project.created_at.desc())

        projects = session.exec(query).all()
        print(f"📦 Returning {len(projects)} projects")
        return projects
    except Exception as e:
        print(f"❌ Error fetching projects: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")


@app.get("/projects/{project_id}", response_model=ProjectRead)
async def get_project(project_id: int, session: Session = Depends(get_session)):
    try:
        project = session.get(Project, project_id)
        if not project:
            raise HTTPException(status_code=404, detail="Project not found")
        return project
    except Exception as e:
        print(f"❌ Error fetching project {project_id}: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")


@app.get("/health")
async def health_check(session: Session = Depends(get_session)):
    try:
        # Test database connection
        session.exec(text("SELECT 1"))
        project_count = session.exec(select(Project)).all()
        return {
            "status": "healthy",
            "message": "API and database are running",
            "project_count": len(project_count)
        }
    except Exception as e:
        print(f"❌ Health check failed: {e}")
        raise HTTPException(
            status_code=500, detail="Database connection failed")


@app.get("/debug/projects")
async def debug_projects(session: Session = Depends(get_session)):
    """Debug endpoint to see raw project data"""
    projects = session.exec(select(Project)).all()
    return {
        "count": len(projects),
        "projects": [
            {
                "id": p.id,
                "title": p.title,
                "has_long_description": p.long_description is not None,
                "technologies": p.technologies
            } for p in projects
        ]
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
