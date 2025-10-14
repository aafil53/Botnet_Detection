from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.security import OAuth2PasswordRequestForm
from app.models.user import User
from app.schemas.auth import UserCreate, UserResponse, Token
from app.services.auth_service import (
    get_password_hash,
    verify_password,
    create_access_token
)
from app.utils.security import get_current_user


router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register(user_data: UserCreate):
    """
    Register a new user
    
    - **email**: Valid email address
    - **username**: Username (3-50 characters)
    - **password**: Password (minimum 6 characters)
    """
    # Check if email already exists
    existing_user = await User.find_one(User.email == user_data.email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Check if username already exists
    existing_username = await User.find_one(User.username == user_data.username)
    if existing_username:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already taken"
        )
    
    # Create new user
    user = User(
        email=user_data.email,
        username=user_data.username,
        hashed_password=get_password_hash(user_data.password)
    )
    
    await user.insert()
    
    # Return user response (without password)
    return UserResponse(
        id=str(user.id),
        email=user.email,
        username=user.username,
        created_at=user.created_at,
        is_active=user.is_active
    )


@router.post("/login", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    """
    Login with email and password
    
    Returns JWT access token
    
    - **username**: Email address (OAuth2 uses 'username' field)
    - **password**: User password
    """
    # Find user by email (OAuth2PasswordRequestForm uses 'username' field)
    user = await User.find_one(User.email == form_data.username)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Verify password
    if not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Check if user is active
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account is inactive"
        )
    
    # Create access token
    access_token = create_access_token(data={"sub": user.email})
    
    return Token(access_token=access_token, token_type="bearer")


@router.get("/me", response_model=UserResponse)
async def get_current_user_info(current_user: User = Depends(get_current_user)):
    """
    Get current authenticated user information
    
    Requires valid JWT token in Authorization header
    """
    return UserResponse(
        id=str(current_user.id),
        email=current_user.email,
        username=current_user.username,
        created_at=current_user.created_at,
        is_active=current_user.is_active
    )


@router.get("/test-protected")
async def test_protected_route(current_user: User = Depends(get_current_user)):
    """
    Test endpoint to verify authentication is working
    """
    return {
        "message": "This is a protected route",
        "user": current_user.username,
        "email": current_user.email
    }
