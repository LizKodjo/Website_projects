from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from app.core.security import create_access_token, get_password_hash, verify_password
from app.schemas.user import Token, UserCreate, UserLogin, UserResponse


router = APIRouter()
security = HTTPBearer()

# Temp memory storage for dev
users_db = {}


@router.post("/register", response_model=UserResponse)
async def regiser(user_data: UserCreate):
    """Register a new user"""
    # Check if user already exists
    if user_data.email in users_db:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registerd"
        )

    # Create user
    user_id = len(users_db) + 1
    user = {
        "id": user_id,
        "email": user_data.email,
        "full_name": user_data.full_name,
        "hashed_password": get_password_hash(user_data.password),
        "is_active": True,
    }

    users_db[user_data.email] = user

    return UserResponse(
        id=user["id"],
        email=user["email"],
        full_name=user["full_name"],
        is_active=user["is_active"],
        created_at="2024-01-01T00:00:00Z",
    )


@router.post("/login", response_model=Token)
async def login(login_data: UserLogin):
    """Login user and return access token"""
    user = users_db.get(login_data.email)

    if not user or not verify_password(login_data.password, user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )

    if not user["is_active"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Inactive user"
        )

    # Create access token
    access_token = create_access_token(data={"sub": user["email"]})

    return Token(access_token=access_token, token_type="bearer")


@router.get("/me", response_model=UserResponse)
async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
):
    """Get current user information"""
    from app.core.security import verify_token

    token = credentials.credentials
    payload = verify_token(token)

    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
        )
    email = payload.get("sub")
    user = users_db.get(email)

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
        )

    return UserResponse(
        id=user["id"],
        email=user["email"],
        full_name=user["full_name"],
        is_active=user["is_active"],
        created_at="2024-01-01T00:00:00Z",
    )
