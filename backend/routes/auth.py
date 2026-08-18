"""Authentication routes."""

import os
from fastapi import APIRouter, Depends, Request, Response
from sqlalchemy.orm import Session

from database import get_db, User
from models.auth import SignupRequest, SigninRequest, UserResponse, AuthResponse
from services.auth_service import AuthService
from core.dependencies import get_current_user

router = APIRouter(prefix="/api/auth", tags=["auth"])

COOKIE_MAX_AGE = 60 * 60 * 24 * 7  # 7 days


def is_cookie_secure(request: Request) -> bool:
    """Determine if cookies should be marked Secure."""
    env = os.getenv("ENVIRONMENT", "development").lower()
    cookie_secure_override = os.getenv("COOKIE_SECURE")
    if cookie_secure_override is not None:
        return cookie_secure_override.lower() in ("true", "1")
    return env == "production" or request.url.scheme == "https"


@router.post("/signup", response_model=AuthResponse)
async def signup(request: SignupRequest, response: Response, req: Request, db: Session = Depends(get_db)):
    """Register a new user account."""
    auth_service = AuthService(db)
    user, token = auth_service.signup(request.email, request.password)

    response.set_cookie(
        key="access_token",
        value=token,
        httponly=True,
        secure=is_cookie_secure(req),
        samesite="lax",
        max_age=COOKIE_MAX_AGE,
    )

    return AuthResponse(
        user=UserResponse.model_validate(user),
        message="Account created successfully",
    )


@router.post("/signin", response_model=AuthResponse)
async def signin(request: SigninRequest, response: Response, req: Request, db: Session = Depends(get_db)):
    """Sign in to an existing account."""
    auth_service = AuthService(db)
    user, token = auth_service.signin(request.email, request.password)

    response.set_cookie(
        key="access_token",
        value=token,
        httponly=True,
        secure=is_cookie_secure(req),
        samesite="lax",
        max_age=COOKIE_MAX_AGE,
    )

    return AuthResponse(
        user=UserResponse.model_validate(user),
        message="Signed in successfully",
    )


@router.post("/signout")
async def signout(response: Response, req: Request):
    """Sign out by clearing the auth cookie."""
    response.delete_cookie(
        key="access_token",
        httponly=True,
        secure=is_cookie_secure(req),
        samesite="lax",
    )
    return {"message": "Signed out successfully"}


@router.get("/me", response_model=UserResponse)
async def get_me(current_user: User = Depends(get_current_user)):
    """Get current authenticated user information."""
    return UserResponse.model_validate(current_user)
