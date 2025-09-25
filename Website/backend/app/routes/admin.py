from flask import request, jsonify, Blueprint
from app.models import ContactMessage
from sqlalchemy.orm import sessionmaker
from app import engine
import os
from dotenv import load_dotenv

load_dotenv()

SECRET_TOKEN = os.getenv("SECRET_TOKEN")

admin_bp = Blueprint("admin", __name__)
Session = sessionmaker(bind=engine)


@admin_bp.route("/admin/messages", methods=["GET"])
def get_messages():
    auth = request.headers.get("Authorization")
    if auth != F"Bearer {SECRET_TOKEN}":
        return jsonify({"error": "Unauthorised"}), 401

    session = Session()
    messages = session.query(ContactMessage).order_by(
        ContactMessage.timestamp.desc()).all()
    session.close()

    return jsonify([{
        "id": msg.id,
        "name": msg.name,
        "email": msg.email,
        "message": msg.message,
        "timestamp": msg.timestamp.isoformat()
    } for msg in messages
    ])


@admin_bp.route("/admin/login", methods=["POST"])
def admin_login():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")

    if username == "admin" and password == "luxury123":
        return jsonify({"token": SECRET_TOKEN}), 200
    else:
        return jsonify({"error": "Invalid credentials"}), 401
