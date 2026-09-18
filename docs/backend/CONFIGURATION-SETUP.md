# Sakhi Backend — Configuration & Environment Setup Guide

This document provides a comprehensive audit of all configuration settings, environment variables, external services, database drivers, and step-by-step instructions for running the **Sakhi (सखी)** backend locally and in production.

---

## 1. Complete Configuration Inventory

The following table contains every environment variable supported and consumed by the backend codebase (`app/core/config.py`).

| Variable | Required? | Purpose | Example / Format | Where Used | Sensitive? |
|---|---|---|---|---|---|
| **`PROJECT_NAME`** | Optional (Default: `"Sakhi"`) | Display name of the backend service | `"Sakhi"` | `app/core/config.py`, `app/main.py`, `health.py` | No |
| **`PROJECT_DESCRIPTION`** | Optional | Descriptive summary in OpenAPI docs | `"AI-Powered Indic Financial Companion Platform"` | `app/core/config.py`, `app/main.py` | No |
| **`VERSION`** | Optional (Default: `"1.0.0"`) | Semantic version of backend API | `"1.0.0"` | `app/core/config.py`, `app/main.py`, `health.py` | No |
| **`API_V1_PREFIX`** | Optional (Default: `"/api/v1"`) | URL prefix for version 1 API routes | `"/api/v1"` | `app/core/config.py`, `app/main.py` | No |
| **`ENVIRONMENT`** | Optional (Default: `"development"`) | Runtime stage (`development`, `staging`, `production`) | `"development"` | `app/core/config.py`, `app/core/logging.py`, `health.py` | No |
| **`DEBUG`** | Optional (Default: `true`) | Enables verbose error messages and debug logging | `true` or `false` | `app/core/config.py`, `app/core/logging.py`, `middleware.py` | No |
| **`HOST`** | Optional (Default: `"0.0.0.0"`) | Host IP interface to bind Uvicorn | `"0.0.0.0"` | `app/core/config.py`, `Dockerfile` | No |
| **`PORT`** | Optional (Default: `8000`) | Network port to bind Uvicorn | `8000` | `app/core/config.py`, `Dockerfile` | No |
| **`DATABASE_URL`** | **REQUIRED for Local & Prod** | Database connection string (PostgreSQL or SQLite fallback) | `postgresql://sakhi_user:pass@localhost:5432/sakhi_db`<br>`sqlite:///./sakhi.db` | `app/core/config.py`, `app/core/database.py`, `alembic/env.py` | **Yes (contains DB password)** |
| **`DB_ECHO`** | Optional (Default: `false`) | Logs all raw SQL queries executed by SQLAlchemy | `false` | `app/core/config.py`, `app/core/database.py` | No |
| **`DB_POOL_SIZE`** | Optional (Default: `10`) | PostgreSQL connection pool size | `10` | `app/core/config.py`, `app/core/database.py` | No |
| **`DB_MAX_OVERFLOW`** | Optional (Default: `20`) | Max overflow connections beyond pool size in PostgreSQL | `20` | `app/core/config.py`, `app/core/database.py` | No |
| **`SECRET_KEY`** | **REQUIRED for Production** (Safe default for Dev) | Cryptographic key for session signing and hashing | `"sakhi-prod-secret-key-change-in-prod"` | `app/core/config.py` | **Yes** |
| **`ENABLE_SECURITY_HEADERS`** | Optional (Default: `true`) | Injects CSP, X-Frame-Options, HSTS headers | `true` | `app/core/config.py`, `app/core/middleware.py` | No |
| **`ALLOWED_HOSTS`** | Optional (Default: `'["*"]'`) | Allowed HTTP Host headers | `'["*"]'` or `'["api.sakhi.in"]'` | `app/core/config.py` | No |
| **`GEMINI_API_KEY`** | **REQUIRED for Live AI** (Optional for dev fallback) | Google Gemini API key for real-time generative reasoning | `"AIzaSy..."` | `app/core/config.py`, `app/services/ai_service.py` | **Yes** |
| **`GEMINI_MODEL`** | Optional (Default: `"gemini-1.5-flash"`) | Google Gemini model identifier | `"gemini-1.5-flash"` | `app/core/config.py`, `app/services/ai_service.py` | No |
| **`AI_FALLBACK_MODE`** | Optional (Default: `true`) | Enables deterministic grounded rule engine if Gemini is offline/unconfigured | `true` | `app/core/config.py`, `app/services/ai_service.py` | No |
| **`VOICE_TTS_PROVIDER`** | Optional (Default: `"gtts"`) | Text-to-Speech engine | `"gtts"` | `app/core/config.py`, `app/services/voice_service.py` | No |
| **`VOICE_CACHE_ENABLED`** | Optional (Default: `true`) | Enables disk caching of synthesized speech audio | `true` | `app/core/config.py`, `app/services/voice_service.py` | No |
| **`VOICE_AUDIO_CACHE_DIR`** | Optional (Default: `"./audio_cache"`) | Filesystem directory for cached audio files | `"./audio_cache"` | `app/core/config.py`, `app/services/voice_service.py` | No |
| **`VOICE_DEFAULT_SPEED`** | Optional (Default: `1.0`) | Default voice playback speed factor | `1.0` | `app/core/config.py`, `app/services/voice_service.py` | No |
| **`BHASHINI_API_KEY`** | Optional (Unused in local dev) | Indic Bhashini AI Pipeline authentication key | `""` | `app/core/config.py` | **Yes** |
| **`BHASHINI_USER_ID`** | Optional (Unused in local dev) | Indic Bhashini AI Pipeline user identifier | `""` | `app/core/config.py` | No |
| **`BHASHINI_PIPELINE_ID`** | Optional (Unused in local dev) | Indic Bhashini AI Pipeline ID | `""` | `app/core/config.py` | No |
| **`CORS_ORIGINS`** | Optional (Default: `['http://localhost:5173', ...]`) | Allowed CORS origin URLs (JSON array or comma-separated) | `'["http://localhost:5173", "http://localhost:3000"]'` | `app/core/config.py`, `app/main.py` | No |
| **`RATE_LIMIT_ENABLED`** | Optional (Default: `true`) | Enables sliding-window rate limiter | `true` | `app/core/config.py`, `app/core/middleware.py` | No |
| **`RATE_LIMIT_PER_MINUTE`** | Optional (Default: `120`) | Max requests allowed per client IP per minute | `120` | `app/core/config.py`, `app/core/middleware.py` | No |
| **`LOG_LEVEL`** | Optional (Default: `"INFO"`) | Logging verbosity (`DEBUG`, `INFO`, `WARNING`, `ERROR`) | `"INFO"` | `app/core/config.py`, `app/core/logging.py` | No |
| **`LOG_FORMAT`** | Optional (Default: `"standard"`) | Log format (`"standard"` for console, `"json"` for aggregators) | `"standard"` or `"json"` | `app/core/config.py`, `app/core/logging.py` | No |

---

## 2. Categorized Configuration Details

### A. Database — PostgreSQL & SQLite Fallback
- **Connection Variable**: `DATABASE_URL`
- **Driver**: `psycopg2-binary>=2.9.9` (synchronous driver for SQLAlchemy 2.x).
- **Dialect Normalization**: If `DATABASE_URL` starts with `postgres://` (Render/Heroku convention), the validator automatically normalizes it to `postgresql://` for SQLAlchemy 2.x compatibility.
- **Connection Pooling**:
  - Automatically enabled for PostgreSQL:
    - `pool_size = 10`
    - `max_overflow = 20`
    - `pool_pre_ping = True` (verifies socket liveness before transaction checkout).
  - Automatically bypassed for SQLite (`check_same_thread = False`).
- **Alembic Database URL**: `alembic/env.py` reads `settings.DATABASE_URL` dynamically from application settings.

### B. Authentication & Security
- **`SECRET_KEY`**: Used for cryptographic operations. Must be set to a strong random 64-character secret in production.
- **`ENABLE_SECURITY_HEADERS`**: Injects `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `X-XSS-Protection: 1; mode=block`, `Referrer-Policy`, `Permissions-Policy`, and `HSTS`.

### C. AI / LLM Configuration (Google Gemini)
- **Implemented Provider**: Google Gemini REST API (`https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent`).
- **Credentials**: `GEMINI_API_KEY` (obtained from Google AI Studio: https://aistudio.google.com/).
- **Model**: `gemini-1.5-flash` (configurable via `GEMINI_MODEL`).
- **Timeout**: 10.0 seconds with `httpx.Client`.
- **Grounded Fallback Mechanism (`AI_FALLBACK_MODE=true`)**:
  - When `GEMINI_API_KEY` is not configured, or if network connectivity is interrupted, the AI Companion seamlessly switches to [`AIService._generate_grounded_fallback()`](file:///c:/Users/sivap/Desktop/Projects/SW/backend/app/services/ai_service.py).
  - The deterministic engine evaluates live database metrics (income, expenses, moneylender debt balance, emergency buffer progress, matched welfare schemes) and responds in Telugu, Hindi, or English.
  - **Local Development Status**: `GEMINI_API_KEY` is **OPTIONAL** for local boots and test execution.

### D. Voice, STT & Text-to-Speech (TTS)
- **Implemented TTS Provider**: `gTTS` (Google Translate Text-to-Speech) + local deterministic 16-bit PCM 24kHz mono WAV synthesizer.
- **Implemented STT Provider**: Base64 audio stream decoding with Indic language tagging and phonetic transcription matching.
- **Audio Caching**: Stores SHA256-hashed audio files in `./audio_cache/` to eliminate re-synthesis delay for lesson narrations and frequent tips.
- **Supported Languages**:
  - `te` / `te-IN` ("సఖి అక్క" / Sakhi Akka — Telugu female persona)
  - `hi` / `hi-IN` ("सखी दीदी" / Sakhi Didi — Hindi female persona)
  - `en` / `en-IN` ("Sakhi Sister" — Indian English female persona)

### E. Government & SHG Schemes
- **Data Source**: 12 verified Central & State schemes seeded locally from [`backend/app/data/schemes_seed.py`](file:///c:/Users/sivap/Desktop/Projects/SW/backend/app/data/schemes_seed.py).
- **Official URLs Preserved**: Includes genuine government portals (e.g., `https://jansuraksha.gov.in`, `https://streenidhi.telangana.gov.in`, `https://pmkvyofficial.org`) and offline application paths (Bank Mitra, CSP, Gram Panchayat, Village Organization).
- **External API Status**: No external government scraping or external APIs are implemented or required.

---

## 3. Step-by-Step Local Development Setup Guide

Follow these exact steps to set up and run the Sakhi backend locally:

### Step 1: Install `uv` Package Manager
Ensure `uv` is installed on your system:
```bash
# Windows PowerShell
powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"

# macOS / Linux
curl -LsSf https://astral.sh/uv/install.sh | sh
```

### Step 2: Synchronize Project Dependencies
From the `backend/` directory, run:
```bash
cd backend
uv sync
```

### Step 3: Create Local `.env` Configuration
Copy the example file to `.env`:
```bash
# Windows PowerShell
Copy-Item .env.example .env

# Linux / macOS
cp .env.example .env
```

### Step 4: Configure Database
- **Option A (SQLite — Zero Setup)**:
  Leave `DATABASE_URL="sqlite:///./sakhi.db"` in `.env`.
- **Option B (PostgreSQL — Production Parity)**:
  Ensure your PostgreSQL instance is running on port 5432, create a database named `sakhi_db`, and set:
  ```env
  DATABASE_URL="postgresql://postgres:your_password@localhost:5432/sakhi_db"
  ```

### Step 5: Run Database Schema Migrations
Execute Alembic migrations to build all database tables:
```bash
uv run alembic upgrade head
```

### Step 6: Bootstrap Reference Data (Schemes & Demo Profile)
Run the production database seed script:
```bash
uv run python scripts/seed_production_data.py
```

### Step 7: Start the FastAPI Backend Server
Launch the development server with live reload:
```bash
uv run uvicorn app.main:app --reload --port 8000
```

### Step 8: Verify Health & Diagnostics Endpoints
- **Liveness Probe**: http://localhost:8000/api/v1/health
- **Readiness Probe**: http://localhost:8000/api/v1/health/ready
- **Metrics Probe**: http://localhost:8000/api/v1/health/metrics
- **Interactive Swagger Docs**: http://localhost:8000/docs

### Step 9: Run Automated Test Suite
Run the 76-test suite to verify 100% pass rate:
```bash
uv run pytest -v
```

---

## 4. Multi-Container Docker Deployment

To launch both PostgreSQL 16 and the Sakhi FastAPI backend together using Docker:

```bash
# From the project root directory:
docker compose up -d --build

# View container logs:
docker compose logs -f backend

# Verify health status:
curl http://localhost:8000/api/v1/health/ready
```

---

## 5. Security & Credentials Checklist

- [x] `.env` and `.env.*` are strictly ignored by `.gitignore`.
- [x] `.env.example` is committed with safe placeholder values.
- [x] No real API keys, database passwords, or JWT secrets are hardcoded in source code.
- [x] Rate limiting is enabled by default to prevent abuse.
- [x] Security headers (CSP, X-Frame-Options, HSTS) are injected into all HTTP responses.
