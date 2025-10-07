from datetime import datetime
from pydantic import BaseModel, EmailStr, field_validator, validator


class UserCreate(BaseModel):
    email: EmailStr
    password: str

    @field_validator("password")
    def password_min_length(cls, v):
        if len(v) < 6:
            raise ValueError("Password must be at least 6 characters")
        return v


class UserLogin(BaseModel):
    # id: int
    email: EmailStr
    password: str


class UserOut(BaseModel):
    id: int
    email: EmailStr
    role: str
    created_at: datetime
