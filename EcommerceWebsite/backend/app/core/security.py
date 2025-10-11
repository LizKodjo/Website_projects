from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    # Ensure password is not too long for bcrypt
    max_length = 72
    if len(password) > max_length:
        password = password[:max_length]
    return pwd_context.hash(password)


def validate_password_length(password: str) -> bool:
    """Validate that password meets length requirements"""
    return 8 <= len(password) <= 72
