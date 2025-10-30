from fastapi import APIRouter, Depends

from app.core.security import verify_token


router = APIRouter()


def get_current_user_id(token: dict = Depends(verify_token)) -> int:
    return int(token.get("sub"))
