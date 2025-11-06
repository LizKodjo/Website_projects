from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr, validator


class UserBase(BaseModel):
    email: EmailStr
    full_name: str


class UserCreate(UserBase):
    password: str

    @validator("password")
    def validate_password_strength(cls, v):
        from app.core.security import validate_password_strength

        validation_result = validate_password_strength(v)
        if not validation_result["is_valid"]:
            raise ValueError("; ".join(validation_result["errors"]))
        return v


class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    full_name: Optional[str] = None
    password: Optional[str] = None


class UserResponse(UserBase):
    id: int
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    email: Optional[str] = None
