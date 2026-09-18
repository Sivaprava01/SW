"""
Sakhi Core Configuration Module.

Loads environment variables using Pydantic Settings v2.
"""

import json
from typing import List, Union
from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings and configuration."""
    
    # Core Project Metadata
    PROJECT_NAME: str = "Sakhi"
    PROJECT_DESCRIPTION: str = "AI-Powered Indic Financial Companion Platform"
    VERSION: str = "1.0.0"
    API_V1_PREFIX: str = "/api/v1"
    
    # Environment & Logging
    ENVIRONMENT: str = "development"
    DEBUG: bool = True
    LOG_LEVEL: str = "INFO"
    
    # Database Configuration (Mandatory: PostgreSQL in development & production)
    DATABASE_URL: str = "postgresql://sakhi_user:sakhi_password@localhost:5432/sakhi_db"
    DB_ECHO: bool = False
    DB_POOL_SIZE: int = 10
    DB_MAX_OVERFLOW: int = 20
    
    # CORS Configuration
    CORS_ORIGINS: Union[List[str], str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ]
    
    # Server Binding
    HOST: str = "0.0.0.0"
    PORT: int = 8000

    # Google Gemini AI & Companion Configuration
    GEMINI_API_KEY: str = ""
    GEMINI_MODEL: str = "gemini-1.5-flash"
    AI_FALLBACK_MODE: bool = True

    # Voice, STT & Indic TTS Configuration
    VOICE_TTS_PROVIDER: str = "gtts"
    VOICE_CACHE_ENABLED: bool = True
    VOICE_AUDIO_CACHE_DIR: str = "./audio_cache"
    VOICE_DEFAULT_SPEED: float = 1.0
    BHASHINI_API_KEY: str = ""
    BHASHINI_USER_ID: str = ""
    BHASHINI_PIPELINE_ID: str = ""

    # Production Security, Rate Limiting & Scaling Configuration
    SECRET_KEY: str = "sakhi-production-secret-key-change-in-prod"
    ENABLE_SECURITY_HEADERS: bool = True
    ALLOWED_HOSTS: Union[List[str], str] = ["*"]
    RATE_LIMIT_ENABLED: bool = True
    RATE_LIMIT_PER_MINUTE: int = 120
    LOG_FORMAT: str = "standard"


    @field_validator("DATABASE_URL", mode="before")
    @classmethod
    def assemble_database_url(cls, v: str) -> str:
        """
        Normalize database URL schemes.
        Ensures 'postgres://' (Render/Heroku style) is converted to 'postgresql://' for SQLAlchemy 2.x.
        """
        if isinstance(v, str):
            if v.startswith("postgres://"):
                return v.replace("postgres://", "postgresql://", 1)
        return v

    @field_validator("CORS_ORIGINS", mode="before")
    @classmethod
    def assemble_cors_origins(cls, v: Union[str, List[str]]) -> List[str]:
        """
        Parse CORS origins if provided as a JSON string or comma-separated list in env.
        """
        if isinstance(v, str):
            if v.startswith("[") and v.endswith("]"):
                try:
                    return json.loads(v)
                except Exception:
                    pass
            return [item.strip() for item in v.split(",") if item.strip()]
        return v

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore"
    )


settings = Settings()
