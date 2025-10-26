from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlmodel import Session, select, text
from typing import List, Optional
import json
import os

from .models import ContactMessage, ContactMessageCreate, Project, ProjectRead, engine, create_db_and_tables

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

# Model for API responses


class ProjectResponse(BaseModel):
    id: int
    title: str
    description: str
    long_description: Optional[str] = None
    technologies: str
    github_url: Optional[str] = None
    live_url: Optional[str] = None
    image_url: Optional[str] = None
    featured: bool
    category: str
    status: str
    priority: int
    created_at: str

    class Config:
        from_attributes = True


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
                title="Developer Portfolio",
                description="Full-stack portfolio website with modern dark theme",
                long_description="A responsive portfolio website built with React, FastAPI, and SCSS. Features a custom dark theme with reddish-gold accents, project filtering, contact form, and full testing suite. Demonstrates full-stack development skills and modern web practices.",
                technologies=json.dumps(
                    ["Python", "FastAPI", "React", "Vite", "SCSS", "SQLite", "SQLModel", "Testing"]),
                github_url="https://github.com/LizKodjo/Website_projects/tree/main/Portfolio",
                live_url="http://localhost:3000",
                featured=True,
                category="web",
                status="completed",
                priority=1
            ),
            Project(
                title="URL Shortener API",
                description="High-performance URL shortener with analytics dashboard",
                long_description="A scalable URL shortening service with click analytics, QR code generation, and API rate limiting. Features Redis caching for performance and a comprehensive admin dashboard.",
                technologies=json.dumps(
                    ["Python", "FastAPI", "Redis", "SQLite", "React", "Chart.js"]),
                github_url="https://github.com/LizKodjo/Website_projects/tree/main/URLShortener",
                live_url="https://short.ek.com",
                featured=True,
                category="api",
                status="in-progress",
                priority=2
            ),
            Project(
                title="Data Visualization Dashboard",
                description="Interactive data visualization with real-time updates",
                long_description="A comprehensive dashboard for visualizing complex datasets with interactive charts, filtering options, and real-time data updates. Perfect for analytics and business intelligence.",
                technologies=json.dumps(
                    ["React", "D3.js", "FastAPI", "WebSockets", "MongoDB"]),
                github_url="https://github.com/LizKodjo/Website_projects/tree/main/covid-dashboard",
                featured=True,
                category="frontend",
                status="planned",
                priority=3
            ),
            Project(
                title="E-Commerce Platform",
                description="Full-stack e-commerce solution with modern tech stack",
                long_description="A complete e-commerce platform featuring user authentication, product management, shopping cart, payment integration, and admin dashboard. Built with microservices architecture.",
                technologies=json.dumps(
                    ["Python", "FastAPI", "React", "PostgreSQL", "Docker", "Redis", "Stripe API"]),
                github_url="https://github.com/LizKodjo/Website_projects/tree/main/EcommerceWebsite",
                live_url="https://ecommerce-demo.ek.com",
                featured=False,
                category="web",
                status="In progress",
                priority=3
            ),
            Project(
                title="Machine Learning API",
                description="REST API for machine learning model predictions",
                long_description="A scalable ML API service that serves predictions from trained models. Includes model versioning, request batching, and comprehensive monitoring with Prometheus and Grafana.",
                technologies=json.dumps(
                    ["Python", "FastAPI", "Scikit-learn", "Docker", "Kubernetes", "Prometheus"]),
                github_url="https://github.com/ek/ml-api",
                featured=False,
                category="data",
                status="planned",
                priority=5
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

        query = query.order_by(Project.priority.asc(), Project.featured.desc(),
                               Project.created_at.desc())

        projects = session.exec(query).all()
        print(f"📦 Returning {len(projects)} projects from database.")
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

# Contact route


@app.post("/contact")
async def send_contact(contact: ContactMessageCreate, session: Session = Depends(get_session)):
    try:
        # Save to database
        db_contact = ContactMessage(**contact.model_dump())
        session.add(db_contact)
        session.commit()
        session.refresh(db_contact)

        # Send email notification later
        # await send_email notification

        return {
            "message": "Thank you for your message! I'll get back to you soon",
            "status": "success"
        }
    except Exception as e:
        print(f"❌ Error saving contact message: {e}")
        raise HTTPException(status_code=500, detail="Failed to send message")

# Optional email function


async def send_email_notification(contact: ContactMessageCreate):
    """This would send an email notification when someone contacts you.  I will set this up later"""
    pass


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
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
