# Sakhi Backend — Configuration & Environment Setup Guide

This document provides a comprehensive audit of all configuration settings, environment variables, external services, database drivers, and step-by-step instructions for running the **Sakhi (सखी)** backend locally with **PostgreSQL** and in production.

---

## 1. Environment Variable Classifications

### A. Required for Local Backend (Mandatory)
| Variable | Purpose | Expected Format | Sensitive? | Feature Affected |
|---|---|---|---|---|
| **`DATABASE_URL`** | Primary PostgreSQL database connection | `postgresql://<user>:<password>@localhost:5432/<dbname>` | **Yes** | Entire backend, all data persistence, migrations |

### B. Required Only for Live Cloud AI (Optional for Local Dev)
| Variable | Purpose | Expected Format | Sensitive? | Feature Affected |
|---|---|---|---|---|
| **`GEMINI_API_KEY`** | Google Gemini API key from Google AI Studio | String starting with `AIzaSy...` | **Yes** | Live cloud conversational Ask Sakhi responses (falls back to deterministic grounded engine when empty) |
| **`GEMINI_MODEL`** | Gemini LLM model identifier | `"gemini-1.5-flash"` | No | LLM response generation |
| **`AI_FALLBACK_MODE`** | Enables deterministic grounded rule engine when key is missing or offline | `true` or `false` | No | Zero-downtime Ask Sakhi companion responses |

### C. Required Only for Voice (Optional for Local Dev)
| Variable | Purpose | Expected Format | Sensitive? | Feature Affected |
|---|---|---|---|---|
| **`VOICE_TTS_PROVIDER`** | Text-to-Speech synthesis provider | `"gtts"` (default, uses HTTPS + local WAV fallback) | No | Audio narration generation |
| **`VOICE_CACHE_ENABLED`** | Enables local disk caching for synthesized audio | `true` or `false` | No | TTS latency reduction |
| **`VOICE_AUDIO_CACHE_DIR`** | Path to cache generated speech audio files | `"./audio_cache"` | No | Audio caching |
| **`VOICE_DEFAULT_SPEED`** | Playback speed factor (0.5 to 2.0) | `1.0` | No | Speech rate cadence |

### D. Required Only for Production
| Variable | Purpose | Expected Format | Sensitive? | Feature Affected |
|---|---|---|---|---|
| **`ENVIRONMENT`** | Runtime environment stage | `"production"` | No | Logging format, HSTS activation |
| **`DEBUG`** | Disables development debug endpoints & stacktraces | `false` | No | Production error envelope security |
| **`SECRET_KEY`** | Cryptographic key for session signing and hashing | Random 64-char string | **Yes** | Cryptographic token operations |
| **`LOG_FORMAT`** | Formats logs as single-line JSON for aggregators | `"json"` | No | Production observability (Datadog/CloudWatch) |
| **`ALLOWED_HOSTS`** | Host header whitelist | `'["api.sakhi.in"]'` | No | HTTP Host header protection |

### E. Optional General Settings
| Variable | Purpose | Expected Format | Sensitive? | Feature Affected |
|---|---|---|---|---|
| **`HOST`** | Network host interface to bind server | `"0.0.0.0"` | No | Uvicorn server binding |
| **`PORT`** | Port number to bind server | `8000` | No | Network port |
| **`CORS_ORIGINS`** | Allowed frontend client origins | `'["http://localhost:5173", "http://localhost:3000"]'` | No | Browser CORS policy |
| **`RATE_LIMIT_ENABLED`** | Enables sliding-window IP rate limiter | `true` | No | DDoS & abuse prevention |
| **`RATE_LIMIT_PER_MINUTE`** | Max requests per minute per IP | `120` | No | Throttling threshold |
| **`DB_POOL_SIZE`** | PostgreSQL connection pool size | `10` | No | Database connection pooling |
| **`DB_MAX_OVERFLOW`** | Max overflow connections beyond pool size | `20` | No | Database connection spike handling |

---

## 2. PostgreSQL Setup & Local Development Workflow

The Sakhi backend uses **PostgreSQL 16** via `psycopg2-binary` and SQLAlchemy 2.x.

### Step-by-Step Commands (Using `uv`)

#### 1. Synchronize Dependencies
```bash
cd backend
uv sync
```

#### 2. Create PostgreSQL Database
In your local PostgreSQL client (psql, pgAdmin, or terminal):
```sql
CREATE DATABASE sakhi_db;
```

#### 3. Create `.env` from `.env.example`
```bash
# Windows PowerShell
Copy-Item .env.example .env

# Linux / macOS
cp .env.example .env
```
Ensure `DATABASE_URL` in `.env` is set to your PostgreSQL instance:
```env
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/sakhi_db"
```

#### 4. Run Alembic Migrations
```bash
uv run alembic upgrade head
```

#### 5. Bootstrap Initial Reference Data (Schemes & Demo Profile)
```bash
uv run python scripts/seed_production_data.py
```

#### 6. Start the FastAPI Development Server
```bash
uv run uvicorn app.main:app --reload --port 8000
```

#### 7. Verify Health Probes & Metrics
- **Liveness Probe**: http://localhost:8000/api/v1/health
- **Readiness Probe**: http://localhost:8000/api/v1/health/ready
- **Metrics Probe**: http://localhost:8000/api/v1/health/metrics
- **Swagger Documentation**: http://localhost:8000/docs

#### 8. Run Automated Test Suite
```bash
uv run pytest -v
```

---

## 3. Multi-Container Docker Deployment

To spin up both PostgreSQL and the backend with automated migrations:
```bash
docker compose up -d --build
```
