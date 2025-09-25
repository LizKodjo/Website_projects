import smtplib
from email.message import EmailMessage
import os
from dotenv import load_dotenv

load_dotenv()


def send_email(name, email, message):
    msg = EmailMessage()
    msg['Subject'] = f"New Contact from {name}"
    msg['From'] = os.getenv('EMAIL_FROM')
    msg['To'] = os.getenv('EMAIL_TO')
    msg.set_content(f"From: {name} <{email}>\n\n{message}")

    with smtplib.SMTP_SSL('smtp.gmail.com', 465) as smtp:
        smtp.login(os.getenv('EMAIL_USER'), os.getenv('EMAIL_PASSWORD'))
        smtp.send_message(msg)
