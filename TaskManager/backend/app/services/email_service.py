import logging
from typing import Optional


logger = logging.getLogger(__name__)


def send_welcome_email(email: str, full_name: Optional[str] = None):
    """Mock email service"""
    try:
        logger.info(f"Welcome email would be sent to: {email}")
        logger.info(f"Welcome to TaskFlow Pro, {full_name or 'User'}!")

        return True
    except Exception as e:
        logger.error(f"Failed to send welcome email: {str(e)}")
        return False
