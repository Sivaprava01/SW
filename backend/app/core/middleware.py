"""
Sakhi Production Middleware Module.

Implements security headers, request tracing with X-Request-ID and latency timers,
and sliding-window IP rate limiting.
"""

import time
import uuid
from collections import defaultdict, deque
from typing import Dict, Deque
from fastapi import Request, Response, status
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware, RequestResponseEndpoint

from app.core.config import settings
from app.core.logging import logger


class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    """Injects standard enterprise security headers into all HTTP responses."""

    async def dispatch(self, request: Request, call_next: RequestResponseEndpoint) -> Response:
        response = await call_next(request)

        if settings.ENABLE_SECURITY_HEADERS:
            response.headers["X-Content-Type-Options"] = "nosniff"
            response.headers["X-Frame-Options"] = "DENY"
            response.headers["X-XSS-Protection"] = "1; mode=block"
            response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
            response.headers["Permissions-Policy"] = "camera=(), microphone=(self), geolocation=()"
            
            # Enable HSTS in non-debug environments
            if not settings.DEBUG:
                response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains; preload"

        return response


class RequestTracingMiddleware(BaseHTTPMiddleware):
    """Assigns unique X-Request-ID and measures execution processing latency."""

    async def dispatch(self, request: Request, call_next: RequestResponseEndpoint) -> Response:
        start_time = time.perf_counter()

        # Extract or generate Request ID
        request_id = request.headers.get("X-Request-ID")
        if not request_id:
            request_id = str(uuid.uuid4())

        # Store in request state for endpoint handlers to access
        request.state.request_id = request_id

        response = await call_next(request)

        process_time_ms = (time.perf_counter() - start_time) * 1000.0
        response.headers["X-Request-ID"] = request_id
        response.headers["X-Process-Time"] = f"{process_time_ms:.2f}ms"

        return response


class RateLimitMiddleware(BaseHTTPMiddleware):
    """
    Sliding-window IP-based rate limiter to protect compute, AI, and TTS endpoints.
    Health checks, documentation, and OpenAPI specs are excluded.
    """

    def __init__(self, app, requests_per_minute: int = 120):
        super().__init__(app)
        self.requests_per_minute = requests_per_minute
        self.request_records: Dict[str, Deque[float]] = defaultdict(deque)

    async def dispatch(self, request: Request, call_next: RequestResponseEndpoint) -> Response:
        if not settings.RATE_LIMIT_ENABLED:
            return await call_next(request)

        path = request.url.path
        # Exclude liveness/readiness probes and API docs from rate limiting
        if path.startswith("/docs") or path.startswith("/redoc") or path.startswith("/openapi.json") or "/health" in path:
            return await call_next(request)

        client_ip = request.client.host if request.client else "127.0.0.1"
        # Extract X-Forwarded-For if behind a proxy or in rate limit testing
        forwarded = request.headers.get("X-Forwarded-For")
        if forwarded:
            client_ip = forwarded.split(",")[0].strip()
        elif client_ip == "testclient":
            # Bypass automated pytest client requests unless explicitly testing rate limiter with X-Forwarded-For
            return await call_next(request)

        now = time.time()
        window_start = now - 60.0
        queue = self.request_records[client_ip]

        # Evict timestamps older than 60 seconds
        while queue and queue[0] < window_start:
            queue.popleft()

        limit = settings.RATE_LIMIT_PER_MINUTE or self.requests_per_minute
        if len(queue) >= limit:
            logger.warning(f"Rate limit exceeded for IP: {client_ip} on {path}")
            return JSONResponse(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                content={
                    "status": "error",
                    "error": {
                        "code": "RATE_LIMIT_EXCEEDED",
                        "message": f"Too many requests. Rate limit is {limit} requests per minute.",
                        "details": {"retry_after_seconds": 60},
                    },
                },
                headers={"Retry-After": "60"},
            )

        queue.append(now)
        return await call_next(request)
