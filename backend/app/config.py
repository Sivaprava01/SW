import os
from typing import Optional, List
from pydantic_settings import BaseSettings
from dotenv import load_dotenv

load_dotenv()

class Settings(BaseSettings):
    PROJECT_NAME: str = "Sakhi - Financial Companion"
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")

    # PostgreSQL as primary production database
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL",
        "postgresql://postgres:postgres@localhost:5432/sakhi"
    )

    # JWT Authentication
    JWT_SECRET: str = os.getenv(
        "JWT_SECRET",
        "sakhi-dev-super-secret-key-change-in-production-2026-financial-ai"
    )
    JWT_ALGORITHM: str = os.getenv("JWT_ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "60"))
    REFRESH_TOKEN_EXPIRE_DAYS: int = int(os.getenv("REFRESH_TOKEN_EXPIRE_DAYS", "7"))

    # AI Service Configuration
    AI_PROVIDER: str = os.getenv("AI_PROVIDER", "gemini")  # "gemini" or "openai"
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    GEMINI_MODEL: str = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")

    # CORS Configuration
    ALLOWED_ORIGINS: str = os.getenv(
        "ALLOWED_ORIGINS",
        "http://localhost:5173,http://127.0.0.1:5173,http://localhost:3000"
    )

    # Rate Limiting Configuration
    LOGIN_RATE_LIMIT: int = int(os.getenv("LOGIN_RATE_LIMIT", "5"))
    REGISTER_RATE_LIMIT: int = int(os.getenv("REGISTER_RATE_LIMIT", "3"))
    REFRESH_RATE_LIMIT: int = int(os.getenv("REFRESH_RATE_LIMIT", "10"))
    AI_RATE_LIMIT: int = int(os.getenv("AI_RATE_LIMIT", "10"))
    AI_RATE_WINDOW_SECONDS: int = int(os.getenv("AI_RATE_WINDOW_SECONDS", "60"))
    REDIS_URL: Optional[str] = os.getenv("REDIS_URL", None)

    # Demo Account
    DEMO_PASSWORD: str = os.getenv("DEMO_PASSWORD", "Lakshmi@Sakhi2026")

    @property
    def allowed_origins_list(self) -> List[str]:
        return [origin.strip() for origin in self.ALLOWED_ORIGINS.split(",") if origin.strip()]

    class Config:
        env_file = ".env"
        extra = "allow"

settings = Settings()
