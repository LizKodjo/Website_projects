# app/__init__.py
from flask import Flask
from flask_cors import CORS
from sqlalchemy import create_engine


def create_app():
    app = Flask(__name__)
    CORS(app)

    # Register routes
    from app.routes.contact import contact_bp
    from app.routes.admin import admin_bp
    app.register_blueprint(contact_bp)
    app.register_blueprint(admin_bp)

    return app

# Optional: expose engine for use in routes


engine = create_engine("sqlite:///contact.db")
