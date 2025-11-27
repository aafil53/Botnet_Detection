from pydantic_settings import BaseSettings
from typing import List
from pydantic import ConfigDict
import os
import json


class Settings(BaseSettings):
    # App
    APP_NAME: str = "Botnet Detection API"
    DEBUG: bool = False
    
    # MongoDB - Support both DATABASE_URL and MONGODB_URL environment variables
    MONGODB_URL: str = "mongodb://localhost:27017"
    DATABASE_URL: str = ""
    DATABASE_NAME: str = "botnet_detection"
    
    # JWT
    SECRET_KEY: str = "your-secret-key-change-in-production-please-make-it-very-long-and-random"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    
    # CORS - Allow localhost for development, add deployed URLs for production
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
    
    def get_database_url(self) -> str:
        """Get database URL with priority: DATABASE_URL > MONGODB_URL > default"""
        if self.DATABASE_URL:
            return self.DATABASE_URL
        return self.MONGODB_URL


def get_allowed_origins_from_env(default: List[str]) -> List[str]:
    """Return ALLOWED_ORIGINS parsed from the ALLOWED_ORIGINS env var.

    Supported formats:
    - JSON array: ["https://a", "https://b"]
    - Comma-separated string: https://a,https://b
    If not set, returns the provided default list.
    """
    raw = os.getenv("ALLOWED_ORIGINS")
    if not raw:
        return default
    raw = raw.strip()
    # JSON array
    try:
        if raw.startswith("["):
            parsed = json.loads(raw)
            if isinstance(parsed, list):
                return [str(x) for x in parsed]
    except Exception:
        pass
    # Comma-separated
    return [p.strip() for p in raw.split(",") if p.strip()]


settings = Settings()
