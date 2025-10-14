from sqlmodel import Session
from app.models import Project, engine
import json


def seed_sample_projects():
    projects = [
        {
            "title": "E-Commerce Platform",
            "description": "Full-stack e-commerce solution with modern tech stack",
            "long_description": "A complete e-commerce platform featuring user authentication, product management, shopping cart, payment integration, and admin dashboard. Built with microservices architecture and deployed using Docker.",
            "technologies": json.dumps(["Python", "FastAPI", "React", "PostgreSQL", "Docker", "Redis", "Stripe API"]),
            "github_url": "https://github.com/ek/ecommerce-platform",
            "live_url": "https://ecommerce-demo.ek.com",
            "featured": True,
            "category": "web"
        },
        {
            "title": "Data Visualization Dashboard",
            "description": "Real-time analytics dashboard with interactive charts",
            "long_description": "A comprehensive data visualization tool that processes large datasets and presents them through interactive charts and graphs. Features real-time updates, filtering, and export capabilities.",
            "technologies": json.dumps(["Python", "FastAPI", "D3.js", "MongoDB", "WebSockets"]),
            "github_url": "https://github.com/ek/data-dashboard",
            "live_url": "https://dashboard.ek.com",
            "featured": True,
            "category": "data-science"
        },
        {
            "title": "Task Management App",
            "description": "Collaborative task management with real-time updates",
            "long_description": "A Kanban-style task management application with real-time collaboration features, file attachments, comments, and progress tracking. Implements WebSocket for live updates.",
            "technologies": json.dumps(["React", "Node.js", "Socket.io", "MongoDB", "Express"]),
            "github_url": "https://github.com/ek/task-manager",
            "featured": False,
            "category": "web"
        },
        {
            "title": "Machine Learning API",
            "description": "REST API for machine learning model predictions",
            "long_description": "A scalable ML API service that serves predictions from trained models. Includes model versioning, request batching, and comprehensive monitoring with Prometheus and Grafana.",
            "technologies": json.dumps(["Python", "FastAPI", "Scikit-learn", "Docker", "Kubernetes", "Prometheus"]),
            "github_url": "https://github.com/ek/ml-api",
            "featured": True,
            "category": "data-science"
        }
    ]

    with Session(engine) as session:
        for project_data in projects:
            project = Project(**project_data)
            session.add(project)
        session.commit()
        print("✅ Sample projects seeded successfully!")


if __name__ == "__main__":
    seed_sample_projects()
