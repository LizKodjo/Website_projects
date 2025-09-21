import smtplib
from email.message import EmailMessage
from app.schemas import ContactForm
import os
from dotenv import load_dotenv


load_dotenv()


def send_email(form: ContactForm) -> bool:
    try:
        msg = EmailMessage()
        msg["Subject"] = f"New Contact from {form.name}"
        msg["From"] = os.getenv("EMAIL_FROM")
        msg["To"] = os.getenv("EMAIL_TO")
        msg.set_content(
            f"Name: {form.name}\nEmail: {form.email}\n\nMessage:\n{form.message}")

        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as smtp:
            smtp.login(os.getenv("EMAIL_FROM"), os.getenv("EMAIL_PASSWORD"))
            smtp.send_message(msg)
        return True
    except Exception as e:
        print("Email error:", e)
        return False
