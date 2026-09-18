import time
import threading
import logging
from collections import defaultdict
from typing import Optional, Dict, List
from fastapi import Request, HTTPException, status
from app.config import settings

logger = logging.getLogger("sakhi.security")

class InMemorySlidingWindowRateLimiter:
    """
    Thread-safe in-memory sliding-window rate limiter.
    Stores timestamps of requests within the active window per identifier.
    """
    def __init__(self):
        self._lock = threading.Lock()
        self._records: Dict[str, List[float]] = defaultdict(list)
        self._last_cleanup = time.time()

    def is_allowed(self, key: str, limit: int, window_seconds: int) -> tuple[bool, int]:
        now = time.time()
        cutoff = now - window_seconds

        with self._lock:
            # Periodic cleanup of expired entries every 300 seconds
            if now - self._last_cleanup > 300:
                keys_to_delete = []
                for k, timestamps in self._records.items():
                    self._records[k] = [t for t in timestamps if t > cutoff]
                    if not self._records[k]:
                        keys_to_delete.append(k)
                for k in keys_to_delete:
                    del self._records[k]
                self._last_cleanup = now

            # Filter timestamps for current key
            valid_timestamps = [t for t in self._records[key] if t > cutoff]
            self._records[key] = valid_timestamps

            if len(valid_timestamps) >= limit:
                retry_after = int(window_seconds - (now - valid_timestamps[0]))
                return False, max(1, retry_after)

            self._records[key].append(now)
            return True, 0


_in_memory_limiter = InMemorySlidingWindowRateLimiter()

def get_client_ip(request: Request) -> str:
    """Extracts client IP, checking X-Forwarded-For header if behind a reverse proxy."""
    forwarded = request.headers.get("X-Forwarded-For")
    if forwarded:
        return forwarded.split(",")[0].strip()
    return request.client.host if request.client else "unknown"

class RateLimit:
    """
    FastAPI dependency for endpoint rate limiting.
    Configured with request limit, time window in seconds, and an endpoint category prefix.
    """
    def __init__(self, limit: int, window_seconds: int = 60, prefix: str = "rl"):
        self.limit = limit
        self.window_seconds = window_seconds
        self.prefix = prefix

    async def __call__(self, request: Request):
        ip = get_client_ip(request)
        key = f"{self.prefix}:{ip}"

        allowed, retry_after = _in_memory_limiter.is_allowed(
            key=key,
            limit=self.limit,
            window_seconds=self.window_seconds
        )

        if not allowed:
            logger.warning(
                f"Rate limit exceeded on '{self.prefix}' by IP {ip}. "
                f"Limit: {self.limit} per {self.window_seconds}s. Retry-After: {retry_after}s."
            )
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail="Too many requests. Please slow down and try again later.",
                headers={"Retry-After": str(retry_after)}
            )
        return True
