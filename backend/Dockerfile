# ==============================================================================
# SAKHI BACKEND PRODUCTION DOCKERFILE
# Multi-stage, minimal, non-root hardened container for FastAPI + Uvicorn
# ==============================================================================

FROM python:3.12-slim-bookworm AS base

ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PIP_NO_CACHE_DIR=off \
    PIP_DISABLE_PIP_VERSION_CHECK=on \
    PORT=8000

# Install runtime OS dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    libpq5 \
    ffmpeg \
    && rm -rf /var/lib/apt/lists/*

# Create unprivileged application user
RUN groupadd -g 1001 sakhi && \
    useradd -u 1001 -g sakhi -s /bin/bash -m sakhiuser

WORKDIR /app

# Install uv package manager
COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

# Copy dependency specifications
COPY pyproject.toml uv.lock ./

# Install production dependencies
RUN uv sync --frozen --no-dev --no-install-project

# Copy application source code and migrations
COPY . /app

# Ensure correct permissions
RUN mkdir -p /app/audio_cache /app/logs && \
    chown -R sakhiuser:sakhi /app && \
    chmod +x /app/entrypoint.sh 2>/dev/null || true

USER sakhiuser

EXPOSE 8000

# Container healthcheck probe
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD curl -f http://localhost:8000/api/v1/health/ready || exit 1

ENTRYPOINT ["/app/entrypoint.sh"]
CMD ["uv", "run", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "4"]
