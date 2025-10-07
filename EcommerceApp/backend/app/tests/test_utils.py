from app.db.session import SessionLocal
from app.models.user import User
from app.services.auth import get_password_hash


def seed_admin_user():
    db = SessionLocal()
    existing = db.query(User).filter(User.email == "admin@example.com").first()
    if not existing:
        admin = User(
            email="admin@example.com",
            hashed_password=get_password_hash("test"),
            role="admin",
            is_active=True
        )
        db.add(admin)
        db.commit()
    db.close()
