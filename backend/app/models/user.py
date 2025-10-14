from beanie import Document
from pydantic import EmailStr, Field
from datetime import datetime
from typing import Optional


class User(Document):
    email: EmailStr
    username: str
    hashed_password: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    is_active: bool = True
    
    class Settings:
        name = "users"
        indexes = [
            "email",
            "username"
        ]
    
    class Config:
        json_schema_extra = {
            "example": {
                "email": "user@example.com",
                "username": "john_doe",
                "is_active": True
            }
        }
