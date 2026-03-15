from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from passlib.context import CryptContext

from app.db import get_db
from app.models import User
from app.schemas import LoginRequest, LoginResponse
from app.dependencies import create_access_token, get_current_user


router = APIRouter()

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)


def hash_password(plain: str) -> str:
    return pwd_context.hash(plain)


@router.post("/login", response_model=LoginResponse)
async def login(payload: LoginRequest, db: AsyncSession = Depends(get_db)):

    # find user by username
    result = await db.execute(select(User).where(User.username == payload.username))
    user = result.scalar_one_or_none()

    # check user exists and password matches
    if not user or not verify_password(payload.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password",
        )

    # check account is active
    if user.status == "inactive":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is inactive. Contact admin.",
        )

    # create token with user_id and role inside
    token = create_access_token(data={"user_id": user.user_id, "role": user.role})

    return LoginResponse(access_token=token, role=user.role)


@router.get("/me")
async def get_me(current_user: User = Depends(get_current_user)):
    return {
        "user_id": current_user.user_id,
        "username": current_user.username,
        "role": current_user.role,
        "email": current_user.email,
        "status": current_user.status,
    }
