from pydantic_settings import BaseSettings
from typing import List
from pydantic import ConfigDict


class Settings(BaseSettings):
    # App
    APP_NAME: str = "Botnet Detection API"
    DEBUG: bool = True
    
    # MongoDB
    MONGODB_URL: str = "mongodb://localhost:27017"
    DATABASE_NAME: str = "botnet_detection"
    
    # JWT
    SECRET_KEY: str = "your-secret-key-change-in-production-please-make-it-very-long-and-random"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    
    # CORS
    ALLOWED_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:5500",
        "http://127.0.0.1:5500",
        "null"
    ]
    
    # Pydantic v2 config
    model_config = ConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore"  # Ignore extra fields from .env
    )


settings = Settings()
