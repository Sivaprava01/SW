"""
Sakhi Main FastAPI Application Entrypoint.

Initializes the FastAPI application, CORS middleware, lifespan events,
global exception handlers, and versioned routing.
"""

from contextlib import asynccontextmanager
from typing import AsyncGenerator
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.logging import logger, setup_logging
from app.core.errors import register_error_handlers
from app.api.v1.router import api_v1_router
from app.schemas.common import RootResponse


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    """Application lifespan context manager for startup and shutdown procedures."""
    # Setup structured logging
    setup_logging()
    logger.info(f"Starting {settings.PROJECT_NAME} backend v{settings.VERSION} (Environment: {settings.ENVIRONMENT})")
    
    # Initialize and migrate database schema
    try:
        from app.core.database import init_db
        init_db()
    except Exception as e:
        logger.error(f"Database schema initialization failed on startup: {e}", exc_info=True)

    yield
    
    logger.info(f"Shutting down {settings.PROJECT_NAME} backend cleanly")


def create_application() -> FastAPI:
    """Application factory for Sakhi FastAPI backend."""
    application = FastAPI(
        title=settings.PROJECT_NAME,
        description=settings.PROJECT_DESCRIPTION,
        version=settings.VERSION,
        docs_url="/docs",
        redoc_url="/redoc",
        openapi_url="/openapi.json",
        lifespan=lifespan,
    )

    # 1. Production Security & Tracing Middlewares
    from app.core.middleware import (
        RequestTracingMiddleware,
        SecurityHeadersMiddleware,
        RateLimitMiddleware,
    )

    application.add_middleware(RequestTracingMiddleware)
    application.add_middleware(SecurityHeadersMiddleware)
    application.add_middleware(RateLimitMiddleware, requests_per_minute=settings.RATE_LIMIT_PER_MINUTE)

    # 2. CORS Middleware
    application.add_middleware(
        CORSMiddleware,
        allow_origins=settings.CORS_ORIGINS if isinstance(settings.CORS_ORIGINS, list) else [settings.CORS_ORIGINS],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # 3. Register Global Error Handlers
    register_error_handlers(application)

    # 3. Mount API v1 Router
    application.include_router(api_v1_router, prefix=settings.API_V1_PREFIX)

    # 4. Root Metadata Endpoint
    @application.get("/", response_model=RootResponse, tags=["General"])
    async def root() -> RootResponse:
        """Root API metadata and service discovery."""
        return RootResponse(
            app=settings.PROJECT_NAME,
            version=settings.VERSION,
            description=settings.PROJECT_DESCRIPTION,
            docs_url="/docs",
            api_v1=f"{settings.API_V1_PREFIX}",
            health=f"{settings.API_V1_PREFIX}/health",
        )

    return application


app = create_application()
