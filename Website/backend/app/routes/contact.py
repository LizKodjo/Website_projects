from fastapi import APIRouter, HTTPException
from app.schemas import ContactForm
from app.utils.email import send_email

router = APIRouter()


@router.post("/")
async def submit_contact(form: ContactForm):
    success = send_email(form)
    if not success:
        raise HTTPException(status_code=500, detail="Email failed to send.")
    return {"message": "Message sent successfully."}
