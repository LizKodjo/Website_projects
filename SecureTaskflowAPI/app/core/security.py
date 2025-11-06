from datetime import datetime, timedelta, timezone
from typing import Optional
from passlib.context import CryptContext
from jose import JWTError, jwt

from app.core.config import settings

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against its hash"""
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    """Hash a password"""
    return pwd_context.hash(password)


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    """Create a JWT access token"""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(
            minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
        )

    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(
        to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM
    )

    return encoded_jwt


def verify_token(token: str):
    """Verify and decode a JWT token"""
    try:
        payload = jwt.decode(
            token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM]
        )
        return payload
    except JWTError:
        return None


def validate_password_strength(password: str) -> dict:
    """Validate password meets security requirements"""
    errors = []

    if len(password) < 8:
        errors.append("Password must be at least 8 characters long")

    if not any(char.isdigit() for char in password):
        errors.append("Password must contain at least one number")

    if not any(char.isupper() for char in password):
        errors.append("Password must contain at least one uppercase letter")

    if not any(char.islower() for char in password):
        errors.append("Password must contain at least one lowercase letter")

    return {"is_valid": len(errors) == 0, "errors": errors}
