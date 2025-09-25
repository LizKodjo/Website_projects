# app/routes/contact.py
from flask import Blueprint, request, jsonify
from app.models import ContactMessage
from sqlalchemy.orm import sessionmaker
from app import engine

contact_bp = Blueprint("contact", __name__)
Session = sessionmaker(bind=engine)


@contact_bp.route("/contact", methods=["POST"])
def contact():
    data = request.get_json()
    name = data.get("name")
    email = data.get("email")
    message = data.get("message")

    if not name or not email or not message:
        return jsonify({"error": "All fields are required"}), 400

    session = Session()
    new_message = ContactMessage(name=name, email=email, message=message)
    session.add(new_message)
    session.commit()
    session.close()

    print(f"Saved message from {name} <{email}>")
    return jsonify({"success": "Message received"}), 200
