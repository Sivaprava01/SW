# Sakhi (सखी) — Backend Foundation (B1)

Clean modular backend implementation for **Sakhi** — AI-Powered Indic Financial Companion Platform.

---

## 🏗️ Architecture Layering

```text
app/
├── core/                  # Core configurations, database engine, logging, error handlers
│   ├── config.py          # Pydantic v2 BaseSettings
│   ├── database.py        # SQLAlchemy 2.x engine, connection pooling, SessionLocal, get_db
│   ├── logging.py         # Standardized structured application logging
│   └── errors.py          # Global exception handlers & standardized error response envelopes
├── api/                   # API routing layer
│   └── v1/                # Version 1 API prefix (/api/v1)
│       ├── router.py      # Aggregated API v1 router
│       └── endpoints/     # Domain endpoints
│           └── health.py  # Liveness (/health) & Readiness (/health/ready) probes
├── models/                # SQLAlchemy 2.x ORM models
│   └── base.py            # DeclarativeBase and common TimestampMixin
├── schemas/               # Pydantic v2 request/response contracts
│   ├── health.py          # Health & readiness payload models
│   └── common.py          # Root & standardized error envelope schemas
├── services/              # Pure domain business logic & calculators
└── main.py                # FastAPI app initialization, lifespan, CORS, and routing
```

---

## 🚀 Getting Started with `uv`

Sakhi uses [`uv`](https://github.com/astral-sh/uv) for fast, deterministic Python environment and dependency management.

### 1. Create Virtual Environment & Install Dependencies
```bash
# Create virtual environment
uv venv .venv

# Install all dependencies including dev tools
uv pip install -r requirements.txt
```

### 2. Configure Environment
```bash
cp .env.example .env
```

### 3. Run Development Server
```bash
uv run uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

### 4. Run Automated Test Suite
```bash
uv run pytest -v
```

### 5. Database Migrations (Alembic)
```bash
# Check current migration status
uv run alembic current

# Generate new migration (when new models are added in future phases)
uv run alembic revision --autogenerate -m "description"

# Apply migrations
uv run alembic upgrade head
```

---

## 📡 Core API Endpoints (B1 Foundation)

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/` | Root service discovery and metadata |
| `GET` | `/api/v1/health` | Liveness probe (returns 200 OK with server status) |
| `GET` | `/api/v1/health/ready` | Readiness probe (verifies database connectivity with `SELECT 1`) |
| `GET` | `/docs` | Interactive Swagger OpenAPI documentation |
| `GET` | `/redoc` | ReDoc API documentation |

---

## 🛡️ Standardized Error Envelope

All unhandled exceptions and validation errors return a consistent envelope:

```json
{
  "status": "error",
  "error": {
    "code": "NOT_FOUND",
    "message": "The requested resource was not found",
    "details": null
  }
}
```
