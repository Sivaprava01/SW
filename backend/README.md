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

## 📡 Core API Endpoints

### 🩺 Health & Diagnostics (B1)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/` | Root service discovery and metadata |
| `GET` | `/api/v1/health` | Liveness probe (returns 200 OK with server status) |
| `GET` | `/api/v1/health/ready` | Readiness probe (verifies database connectivity with `SELECT 1`) |
| `GET` | `/docs` | Interactive Swagger OpenAPI documentation |
| `GET` | `/redoc` | ReDoc API documentation |

### 👤 Users & Personalization (B2)
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/v1/users` | Onboard a new user with demographic & baseline financial data |
| `GET` | `/api/v1/users/demo/lakshmi` | Get or auto-seed the official Lakshmi reference demo profile |
| `GET` | `/api/v1/users/{id}` | Get user profile by ID |
| `PATCH` | `/api/v1/users/{id}` | Update user demographics, language, or SHG attributes |
| `DELETE` | `/api/v1/users/{id}` | Delete a user profile |
| `GET` | `/api/v1/users` | List users with pagination |

### 💰 Personal Finance, Cashflow & Health Calculations (B3)
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/v1/users/{user_id}/transactions` | Log an income or expense transaction |
| `GET` | `/api/v1/users/{user_id}/transactions` | List user transactions with optional `?type=` filter |
| `DELETE` | `/api/v1/users/{user_id}/transactions/{tx_id}` | Delete a logged transaction |
| `GET` | `/api/v1/users/{user_id}/financial-health` | Deterministic surplus, savings ratio, emergency target, and health status |

### 🎯 Goals & Micro-Savings System (B4)
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/v1/users/{user_id}/goals` | Create a savings goal with monthly requirements math |
| `GET` | `/api/v1/users/{user_id}/goals` | List user goals with progress % and monthly savings needed |
| `GET` | `/api/v1/users/{user_id}/goals/{goal_id}` | Get goal details and progress |
| `POST` | `/api/v1/users/{user_id}/goals/{goal_id}/deposit` | Add savings deposit towards goal |
| `PATCH` | `/api/v1/users/{user_id}/goals/{goal_id}` | Update goal parameters |
| `DELETE` | `/api/v1/users/{user_id}/goals/{goal_id}` | Delete a goal |

### 💳 Debt Management & Snowball Refinancing (B4)
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/v1/users/{user_id}/debts` | Record a loan liability (moneylender, SHG, bank) |
| `GET` | `/api/v1/users/{user_id}/debts` | List user debts with calculated monthly interest drain |
| `GET` | `/api/v1/users/{user_id}/debts/{debt_id}` | Get specific debt record |
| `PATCH` | `/api/v1/users/{user_id}/debts/{debt_id}` | Update balance, interest rate, or mark cleared |
| `DELETE` | `/api/v1/users/{user_id}/debts/{debt_id}` | Delete a debt record |
| `GET` | `/api/v1/users/{user_id}/debts-analysis/snowball` | Deterministic interest drain, SHG refinance savings, and snowball/avalanche rankings |

### 🧮 Deterministic Financial Calculators (B5)
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/v1/calculators/emergency-fund` | Calculate 3-month emergency safety buffer (Suraksha Kavach) and savings plans |
| `POST` | `/api/v1/calculators/debt-refinance` | Moneylender (36-60%) vs SHG (12%) interest arbitrage & monthly rupee savings |
| `POST` | `/api/v1/calculators/recurring-deposit` | Post Office / Bank RD quarterly compounded maturity and interest earned |
| `POST` | `/api/v1/calculators/goal-horizon` | Calculate goal timeline & required allocation based on monthly surplus |

### 📚 Financial Knowledge Base & Golden Rules (B5)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/v1/knowledge/concepts` | List verified financial literacy concepts (English, Telugu, Hindi) |
| `GET` | `/api/v1/knowledge/concepts/{id}` | Get single concept with practical actions and warning pitfalls |
| `GET` | `/api/v1/knowledge/golden-rules` | Retrieve the 5 official Sakhi Golden Financial Rules |

### 🚀 7-Stage Financial Journey & Learning (B6)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/v1/users/{user_id}/journey` | Deterministic 7-stage roadmap progress evaluated against user's live financial data |
| `GET` | `/api/v1/learning/modules` | List educational modules & micro-lessons with multilingual audio scripts |
| `GET` | `/api/v1/learning/modules/{module_id}` | Get module details and contained lessons |
| `GET` | `/api/v1/learning/lessons/{lesson_id}` | Get micro-lesson with audio narration transcript and quiz |
| `POST` | `/api/v1/users/{user_id}/learning/lessons/{lesson_id}/complete` | Mark lesson completed with optional quiz score |
| `GET` | `/api/v1/users/{user_id}/learning/progress` | Get user overall learning completion percentage |

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
