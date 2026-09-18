# SH-105: Full-Stack Foundation Audit Report

**Project:** Sakhi (सखी) — AI-Powered Financial Companion  
**Stack:** React (Vite, Tailwind CSS, Lucide Icons) + FastAPI (Python 3.12, Pydantic v2, SQLAlchemy)  
**Date:** September 18, 2026  
**Auditor:** Senior Full-Stack Engineer & Codebase Auditor  

---

# 1. Executive Summary

This codebase audit evaluated the initial foundation created for **Sakhi (सखी)** — an AI-powered financial companion tailored for rural women and individuals with limited financial literacy.

### Overall Architecture
The repository follows a clean, modular, and well-thought-out full-stack architecture:
- **Frontend**: Mobile-first React application built with Vite, Tailwind CSS, Lucide Icons, and Canvas Confetti. Uses React Context (`UserContext`) and a tab-based navigation shell.
- **Backend**: FastAPI (Python 3.12 / Pydantic v2 / SQLAlchemy) structured into dedicated API routers, Pydantic schemas, database models, and service layers.
- **Financial Calculation Engine**: Centralized in [`financial_engine.py`](file:///c:/Users/sivap/Desktop/Projects/SW/backend/app/services/financial_engine.py), enforcing the core philosophy: *"Backend calculates → AI explains → User understands"*.
- **AI Integration**: Dual-mode engine in [`ai_service.py`](file:///c:/Users/sivap/Desktop/Projects/SW/backend/app/services/ai_service.py) supporting Gemini API (`google-genai`), OpenAI API (`openai`), and a grounded, zero-hallucination deterministic fallback.

### What is Already Good
- **Deterministic Math Core**: Financial surplus, emergency fund benchmarks, goal monthly savings requirements, and the 7-stage roadmap are computed exclusively in backend Python services rather than delegated to an LLM.
- **Rich Indian Financial Dataset**: Pre-seeded with 15 verified Indian Central & State (Telangana) government schemes ([`schemes_seed.py`](file:///c:/Users/sivap/Desktop/Projects/SW/backend/app/data/schemes_seed.py)) and a rule-based eligibility matcher.
- **Instant Demo Experience**: Pre-seeded **Lakshmi** profile for 1-tap hackathon evaluation.
- **Accessibility & Voice**: Integrated Web Speech recognition and speech synthesis in the UI for low-literacy users.

### Biggest Risks & Blockers
1. **Committed Virtual Environment (`backend/venv`)**: A non-portable virtual environment (8,800+ files) created on another machine was committed to git, blocking local execution on other development machines.
2. **Missing Production Routing & CORS Configuration**: Lack of a `netlify.toml` / `_redirects` proxy and `render.yaml` startup config will block Netlify + Render deployment.
3. **Dual Modal State in Frontend**: [`AskSakhiModal.jsx`](file:///c:/Users/sivap/Desktop/Projects/SW/frontend/src/components/AskSakhiModal.jsx) is mounted twice (once in `App.jsx` and once in `Layout.jsx`) with unsynchronized local state.
4. **PostgreSQL URL Dialect Compatibility**: Render PostgreSQL URLs (`postgres://`) will fail in SQLAlchemy 2.0 unless normalized to `postgresql://`.

### Suitability to Continue Building On
**The foundation is solid, well-structured, and ready to continue building on.** The core domain logic, schemas, UI components, and calculation engines are written and aligned with the hackathon goals. Fixing the environment and deployment configuration will take under 30 minutes.

---

# 2. Current Architecture

```text
SW/
│
├── README.md                           # Project documentation & quick-start guide
├── FOUNDATION_AUDIT.md                 # This comprehensive full-stack audit report
│
├── backend/                            # FastAPI Backend Application
│   ├── .env.example                    # Sample environment variables
│   ├── requirements.txt                # Python dependencies
│   ├── sakhi.db                        # Committed SQLite database (local artifact)
│   ├── test_financial_engine.py        # Backend verification test suite
│   ├── venv/                           # [CRITICAL ISSUE] Committed virtual environment
│   └── app/
│       ├── __init__.py
│       ├── config.py                   # Pydantic Settings & environment loader
│       ├── database.py                 # SQLAlchemy engine, sessionmaker & SQLite fallback
│       ├── main.py                     # FastAPI app initialization, CORS, lifespan & router mounting
│       ├── api/                        # API route controllers
│       │   ├── users.py                # User onboarding & demo Lakshmi endpoint
│       │   ├── transactions.py         # Transaction logging & deletion
│       │   ├── financial_health.py     # Deterministic financial overview
│       │   ├── journey.py              # 7-stage roadmap progress calculation
│       │   ├── goals.py                # Savings goals CRUD & progress math
│       │   ├── schemes.py              # Government schemes search & filtering
│       │   └── ai.py                   # Ask Sakhi AI chat endpoint with financial context
│       ├── data/
│       │   └── schemes_seed.py         # 15 authentic Central & Telangana government schemes
│       ├── models/                     # SQLAlchemy ORM database models
│       │   ├── user.py                 # User profile table
│       │   ├── transaction.py          # Income/Expense transaction records
│       │   ├── goal.py                 # Savings goals table
│       │   ├── scheme.py               # Government schemes table
│       │   └── user_scheme_match.py    # Scheme bookmark & match history
│       ├── schemas/                    # Pydantic v2 request/response schemas
│       │   ├── user.py
│       │   ├── transaction.py
│       │   ├── goal.py
│       │   ├── scheme.py
│       │   └── ai.py
│       └── services/                   # Core business logic & deterministic math
│           ├── financial_engine.py     # Deterministic surplus, goal & journey math
│           ├── scheme_matcher.py       # Rule-based eligibility scoring engine
│           └── ai_service.py           # Gemini/OpenAI caller + grounded fallback
│
└── frontend/                           # React + Vite Frontend Application
    ├── .gitignore                      # Frontend gitignore
    ├── .oxlintrc.json                  # Oxlint configuration
    ├── index.html                      # HTML template with mobile viewport configuration
    ├── package.json                    # NPM dependencies & scripts
    ├── package-lock.json               # NPM dependency lockfile
    ├── vite.config.js                  # Vite configuration + API dev proxy
    ├── public/                         # Static icons & favicon
    └── src/
        ├── App.css                     # Global styles
        ├── App.jsx                     # Main application shell & tab routing
        ├── index.css                   # Tailwind CSS imports & theme tokens
        ├── main.jsx                    # React 19 root entrypoint
        ├── assets/                     # Static assets & SVG icons
        ├── context/
        │   └── UserContext.jsx         # React Context for user state & financial data refresh
        ├── services/
        │   └── api.js                  # Frontend API client (fetch wrapper)
        ├── components/                 # Reusable UI components
        │   ├── AskSakhiModal.jsx       # AI chat modal with Voice (STT) and Listen (TTS)
        │   ├── GoalCard.jsx            # Savings goal card with progress bar
        │   ├── JourneyCard.jsx         # 7-stage financial journey hero widget
        │   ├── Layout.jsx              # Header, bottom navigation & floating action button
        │   ├── MoneyCard.jsx           # Financial metrics card (Income, Expense, Surplus, Debt)
        │   ├── ProgressBar.jsx         # Custom animated progress bar
        │   ├── SchemeCard.jsx          # Government scheme card with match badges
        │   ├── SchemeDetailsModal.jsx  # Detailed scheme modal with official portal links
        │   └── TransactionList.jsx     # Transaction history & "Log Entry" modal
        └── pages/                      # Application views (Tabs)
            ├── Home.jsx                # Dashboard overview & quick actions
            ├── MyMoney.jsx             # Financial health breakdown & transactions
            ├── Journey.jsx             # 7-stage roadmap interactive view
            ├── Goals.jsx               # Goals list & creation wizard
            ├── Benefits.jsx            # Schemes browser & eligibility matching wizard
            ├── Learn.jsx               # Financial literacy modules (Emergency fund, debt, etc.)
            └── Onboarding.jsx          # 3-step onboarding form + 1-tap Lakshmi demo
```

### Directory Evaluation
- **`backend/app/services/`**: Placing deterministic math in [`financial_engine.py`](file:///c:/Users/sivap/Desktop/Projects/SW/backend/app/services/financial_engine.py) and [`scheme_matcher.py`](file:///c:/Users/sivap/Desktop/Projects/SW/backend/app/services/scheme_matcher.py) cleanly separates business rules from HTTP handling and database queries.
- **`backend/app/api/`**: Routers are logically grouped by domain entity (`users`, `transactions`, `goals`, `schemes`, `journey`, `financial-health`, `ai`).
- **`frontend/src/components/` & `pages/`**: Clean separation between reusable display primitives and top-level page views.
- **Root Configuration Gap**: Lack of a root `.gitignore` allowed `backend/venv` and `backend/sakhi.db` to enter git.

---

# 3. ✅ What's Good

✓ **Strict Separation of Deterministic Math and AI Explanation**  
The calculation engine in [`financial_engine.py`](file:///c:/Users/sivap/Desktop/Projects/SW/backend/app/services/financial_engine.py) computes surplus, emergency fund requirements, required monthly savings, and journey stages with 100% deterministic Python math. The AI prompt in [`ai_service.py`](file:///c:/Users/sivap/Desktop/Projects/SW/backend/app/services/ai_service.py#L16-L22) strictly forbids the LLM from recalculating numbers.

✓ **Grounded Offline Fallback for AI**  
If no Gemini/OpenAI API keys are configured or if external APIs encounter network errors, [`generate_fallback_reply()`](file:///c:/Users/sivap/Desktop/Projects/SW/backend/app/services/ai_service.py#L24-L93) provides responses that reference the user's exact financial metrics (surplus, debt, required savings).

✓ **Mobile-First & Low-Literacy UI Design**  
The interface ([`Layout.jsx`](file:///c:/Users/sivap/Desktop/Projects/SW/frontend/src/components/Layout.jsx) & [`index.css`](file:///c:/Users/sivap/Desktop/Projects/SW/frontend/src/index.css)) is constrained to a 480px mobile viewport, uses high-contrast cards, large touch targets, simplified financial terminology (e.g., *Suraksha Kavach*, *Aamadni*, *Kharch*), and includes Web Speech recognition (Mic) and SpeechSynthesis ("Listen") in [`AskSakhiModal.jsx`](file:///c:/Users/sivap/Desktop/Projects/SW/frontend/src/components/AskSakhiModal.jsx#L74-L109).

✓ **Authentic Dataset of 15 Government Schemes with Matcher**  
[`schemes_seed.py`](file:///c:/Users/sivap/Desktop/Projects/SW/backend/app/data/schemes_seed.py) contains real, verified Central and Telangana schemes (PMMY Mudra, Lakhpati Didi, Stree Nidhi, MSSC, SSY, PMSBY, PMJJBY, APY, PM SVANidhi, PMAY-G, PM Vishwakarma). [`scheme_matcher.py`](file:///c:/Users/sivap/Desktop/Projects/SW/backend/app/services/scheme_matcher.py) provides preliminary matching based on age, gender, state, SHG status, and trade interest.

✓ **Mandatory Compliance Disclaimers Built In**  
Every scheme result and scheme modal prominently displays the required disclaimer:
> *"Sakhi provides a preliminary eligibility match and does not provide official eligibility confirmation."*

✓ **One-Tap Demo Flow for Judges**  
[`Onboarding.jsx`](file:///c:/Users/sivap/Desktop/Projects/SW/frontend/src/pages/Onboarding.jsx#L36-L47) and [`users.py`](file:///c:/Users/sivap/Desktop/Projects/SW/backend/app/api/users.py#L65-L100) provide an instant *"Instant Demo as Lakshmi"* button that sets up the official demo profile (Telangana, ₹12k income, ₹7k expenses, ₹5k surplus, ₹20k debt, ₹50k goal) in one click without manual typing.

✓ **Safe Database Fallback**  
[`database.py`](file:///c:/Users/sivap/Desktop/Projects/SW/backend/app/database.py#L11-L24) attempts PostgreSQL connection first and automatically falls back to local SQLite (`sakhi.db`) if PostgreSQL is not running locally, preventing startup crashes during local development.

✓ **Relative API Client Pathing**  
[`api.js`](file:///c:/Users/sivap/Desktop/Projects/SW/frontend/src/services/api.js#L1) uses `const API_BASE = '/api'` with Vite dev proxying in [`vite.config.js`](file:///c:/Users/sivap/Desktop/Projects/SW/frontend/vite.config.js#L10-L16), avoiding hardcoded `http://localhost:8000` URLs in frontend code.

---

# 4. ⚠️ Problems / Risks

### Priority: CRITICAL

**Problem:** Committed virtual environment in `backend/venv` with hardcoded machine paths.  
**Why it matters:** `backend/venv/pyvenv.cfg` points to `C:\Users\Shreyas\AppData\Local\Programs\Python\Python312\python.exe`. Trying to run Python or Uvicorn from `backend/venv` fails immediately on any other machine with `No Python at '"C:\Users\Shreyas\...'`. It also adds 8,800+ tracked binary files to git.  
**Probable fix:** Add a root `.gitignore` ignoring `venv/`, `__pycache__/`, `.env`, and `*.db`. Remove `backend/venv` from git tracking and create a fresh local venv.  
**Files involved:** [`.gitignore`](file:///c:/Users/sivap/Desktop/Projects/SW/.gitignore), [`backend/venv/pyvenv.cfg`](file:///c:/Users/sivap/Desktop/Projects/SW/backend/venv/pyvenv.cfg).

---

### Priority: HIGH

**Problem:** Netlify production build will fail to communicate with the Render backend without reverse proxy configuration.  
**Why it matters:** [`api.js`](file:///c:/Users/sivap/Desktop/Projects/SW/frontend/src/services/api.js#L1) calls `/api/*`. While this works in Vite development via `vite.config.js` proxy, on Netlify, `/api/*` will hit Netlify's CDN and return `404 Not Found`.  
**Probable fix:** Support `VITE_API_URL` environment variable in `api.js` (e.g., `const API_BASE = import.meta.env.VITE_API_URL || '/api'`) and add a `netlify.toml` with redirect proxy rules.  
**Files involved:** [`frontend/src/services/api.js`](file:///c:/Users/sivap/Desktop/Projects/SW/frontend/src/services/api.js), [`frontend/vite.config.js`](file:///c:/Users/sivap/Desktop/Projects/SW/frontend/vite.config.js).

---

### Priority: HIGH

**Problem:** Render PostgreSQL URL dialect incompatibility (`postgres://` vs `postgresql://`).  
**Why it matters:** Render managed PostgreSQL databases inject `DATABASE_URL=postgres://...`. SQLAlchemy 2.0 rejects `postgres://` and raises `NoSuchModuleError: Can't load plugin: sqlalchemy.dialects:postgres`.  
**Probable fix:** In [`database.py`](file:///c:/Users/sivap/Desktop/Projects/SW/backend/app/database.py) / [`config.py`](file:///c:/Users/sivap/Desktop/Projects/SW/backend/app/config.py), if `database_url.startswith("postgres://")`, replace it with `postgresql://`.  
**Files involved:** [`backend/app/database.py`](file:///c:/Users/sivap/Desktop/Projects/SW/backend/app/database.py), [`backend/app/config.py`](file:///c:/Users/sivap/Desktop/Projects/SW/backend/app/config.py).

---

### Priority: MEDIUM

**Problem:** CORS configuration uses `allow_origins=["*"]` alongside `allow_credentials=True`.  
**Why it matters:** According to the W3C fetch specification, browsers reject responses containing `Access-Control-Allow-Origin: *` when `Access-Control-Allow-Credentials: true` is set.  
**Probable fix:** Either set `allow_credentials=False` (since authentication does not rely on browser cookies), or specify explicit allowed origins (e.g., `["http://localhost:5173", "http://localhost:3000", "https://*.netlify.app"]`).  
**Files involved:** [`backend/app/main.py`](file:///c:/Users/sivap/Desktop/Projects/SW/backend/app/main.py#L88-L94).

---

### Priority: MEDIUM

**Problem:** Transaction creation double-mutates user monthly income and expenses baseline.  
**Why it matters:** In [`api/transactions.py`](file:///c:/Users/sivap/Desktop/Projects/SW/backend/app/api/transactions.py#L28-L31), when a transaction is added, it adds `tx.amount` to `user.monthly_income` or `user.monthly_expenses`. However, [`financial_engine.py`](file:///c:/Users/sivap/Desktop/Projects/SW/backend/app/services/financial_engine.py#L125-L128) already computes `max(user.monthly_income, sum(tx.amount))`. This causes cumulative compounding of baseline numbers when multiple one-off transactions are logged.  
**Probable fix:** Do not mutate `user.monthly_income` inside `create_transaction`; let `financial_engine.py` dynamically aggregate transactions against the initial profile baseline.  
**Files involved:** [`backend/app/api/transactions.py`](file:///c:/Users/sivap/Desktop/Projects/SW/backend/app/api/transactions.py), [`backend/app/services/financial_engine.py`](file:///c:/Users/sivap/Desktop/Projects/SW/backend/app/services/financial_engine.py).

---

### Priority: LOW

**Problem:** Missing root-level or backend `.gitignore`.  
**Why it matters:** SQLite database `backend/sakhi.db` and bytecode caches (`__pycache__`) get committed to git, leading to merge conflicts.  
**Probable fix:** Create a comprehensive root `.gitignore`.  
**Files involved:** [`.gitignore`](file:///c:/Users/sivap/Desktop/Projects/SW/.gitignore).

---

# 5. 🐛 Bugs Found

### Bug 1: Duplicate `AskSakhiModal` instances with split state
- **Bug:** Two separate instances of [`AskSakhiModal`](file:///c:/Users/sivap/Desktop/Projects/SW/frontend/src/components/AskSakhiModal.jsx) are rendered simultaneously in the DOM.
- **Expected:** A single modal instance controlled by a unified state or context so conversation history is preserved regardless of how the user opens it (via Header, Home Hero button, or Floating Action Button).
- **Actual:** [`App.jsx`](file:///c:/Users/sivap/Desktop/Projects/SW/frontend/src/App.jsx#L76-L79) renders `<AskSakhiModal isOpen={showAskSakhi} onClose={() => setShowAskSakhi(false)} />` controlled by `App`'s state. Inside [`Layout.jsx`](file:///c:/Users/sivap/Desktop/Projects/SW/frontend/src/components/Layout.jsx#L110-L113), a second `<AskSakhiModal>` is rendered controlled by `Layout`'s independent `useState(false)`.
- **Root cause:** Modal was mounted inside `Layout.jsx` and also mounted inside `App.jsx` wrapping `Layout`.
- **Fix:** Remove the modal instantiation and state from `Layout.jsx`, and pass `onOpenAskSakhi` from `App.jsx` into `Layout.jsx` (or place modal visibility in `UserContext`).

---

### Bug 2: Potential `NaN` in `ProgressBar.jsx` when `max` is zero
- **Bug:** Progress bar inline CSS width renders as `width: NaN%`.
- **Expected:** When `max <= 0` or undefined, `percent` should evaluate to `0` or `100` safely without `NaN`.
- **Actual:** In [`ProgressBar.jsx`](file:///c:/Users/sivap/Desktop/Projects/SW/frontend/src/components/ProgressBar.jsx#L4), `const percent = Math.min(100, Math.max(0, Math.round((value / max) * 100)));`. If `max === 0`, `value / 0` yields `Infinity` or `NaN`.
- **Root cause:** Missing check for `max <= 0`.
- **Fix:** Add guard: `const percent = max <= 0 ? 0 : Math.min(100, Math.max(0, Math.round((value / max) * 100)));`.

---

### Bug 3: Render PostgreSQL dialect error (`postgres://` instead of `postgresql://`)
- **Bug:** FastAPI crash on startup when connected to a hosted PostgreSQL instance on Render.
- **Expected:** Successful connection to PostgreSQL using SQLAlchemy 2.0.
- **Actual:** SQLAlchemy raises `NoSuchModuleError: Can't load plugin: sqlalchemy.dialects:postgres`.
- **Root cause:** Render assigns `DATABASE_URL` with `postgres://...` scheme, which was deprecated in SQLAlchemy 1.4+.
- **Fix:** In [`database.py`](file:///c:/Users/sivap/Desktop/Projects/SW/backend/app/database.py), sanitize `database_url`:
  ```python
  if database_url and database_url.startswith("postgres://"):
      database_url = database_url.replace("postgres://", "postgresql://", 1)
  ```

---

### Bug 4: Database connection test at module import time
- **Bug:** Slow application import / potential startup freeze if remote database is slow or unreachable.
- **Expected:** Engine creation should be lazy; actual connection should occur inside the FastAPI `lifespan` handler.
- **Actual:** [`database.py`](file:///c:/Users/sivap/Desktop/Projects/SW/backend/app/database.py#L15) calls `with engine.connect() as conn:` directly at top-level module import.
- **Root cause:** Synchronous database handshake during Python import cycle.
- **Fix:** Move the connection verification into the `lifespan` function in [`main.py`](file:///c:/Users/sivap/Desktop/Projects/SW/backend/app/main.py#L24-L76).

---

# 6. 🔐 Security Findings

- **Critical:** *No issues found.* No API keys, credentials, or production tokens are committed.
- **High:** *No issues found.* Frontend does not embed private AI keys or secrets.
- **Medium:**
  - **CORS Wildcard with Credentials:** [`main.py`](file:///c:/Users/sivap/Desktop/Projects/SW/backend/app/main.py#L90-L94) has `allow_origins=["*"]` with `allow_credentials=True`. While not exploitable without cookies/session auth, it violates browser fetch CORS specifications and will cause console warnings in standard browsers.
  - **Local Storage User ID:** User ID UUID is stored in `localStorage.getItem('sakhi_user_id')`. For a non-financial-transaction MVP without banking credentials, this is acceptable and standard.
- **Low:**
  - **Committed SQLite DB (`sakhi.db`):** Contains mock seed data. It should be removed from git to keep repository clean.

---

# 7. 🚀 Deployment Readiness

### Netlify (Frontend)
- **Status:** **Ready with 1 minor config addition.**
- **Blockers:**
  1. `frontend/src/services/api.js` currently uses a hardcoded relative path `const API_BASE = '/api'`.
  2. Netlify needs a `_redirects` file or `netlify.toml` in `frontend/public/` or `frontend/`:
     ```toml
     [[redirects]]
       from = "/api/*"
       to = "https://YOUR-RENDER-BACKEND.onrender.com/api/:splat"
       status = 200
       force = true
     ```
  3. `package.json` build command is `vite build`, which creates `frontend/dist`. Publish directory should be set to `dist`.

### Render (Backend)
- **Status:** **Ready with 2 minor config additions.**
- **Blockers:**
  1. Port binding: Render injects `$PORT` environment variable. Startup command should be:
     `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
  2. `psycopg2-binary` is already present in [`requirements.txt`](file:///c:/Users/sivap/Desktop/Projects/SW/backend/requirements.txt#L6), which is correct for Render deployment.

### Hosted PostgreSQL
- **Status:** **Ready.**
- **Blockers:**
  1. URL fix for `postgres://` -> `postgresql://` in `database.py`.
  2. Schema tables auto-create during startup via `Base.metadata.create_all(bind=engine)` in `lifespan`.

---

# 8. 🧱 Architecture Recommendations

1. **Retain Tab-Based Navigation (Do NOT add heavy routing):**
   The current tab state mechanism in [`App.jsx`](file:///c:/Users/sivap/Desktop/Projects/SW/frontend/src/App.jsx) is lightweight, responsive, and completely immune to SPA 404 routing bugs on static hosts. Keep this structure for the 20-hour hackathon.

2. **Retain Context-Based State Management (`UserContext`):**
   `UserContext` manages the current user and triggers `refreshFinancialData()` whenever goals, transactions, or profile updates occur. Do NOT introduce Redux or complex state libraries; the current approach is clean and maintainable.

3. **Keep `financial_engine.py` as Single Source of Truth:**
   All financial metrics (surplus, emergency fund percentage, months remaining, monthly required savings, journey progression) must continue to be computed in Python services. The AI prompt in `ai_service.py` is well-constructed and should remain strictly an explainer.

4. **Add a Root `.gitignore`:**
   Ensure `backend/venv/`, `node_modules/`, `*.db`, and `.env` are globally ignored across the repository.

---

# 9. 📋 Recommended Fix Order

### P0 — Must fix before coding MVP
1. **Remove `backend/venv` from git and create a clean root `.gitignore`**
   - Untrack `backend/venv` and `backend/sakhi.db` from git.
   - Add root `.gitignore`.
   - Recreate virtual environment with Python 3.12 / 3.13 and run `pip install -r requirements.txt`.
   - Run `npm install` in `frontend/`.
2. **Fix Duplicate `AskSakhiModal` in `Layout.jsx` and `App.jsx`**
   - Unify modal triggering so that tapping "Ask Sakhi" anywhere opens the same synchronized modal instance.
3. **Fix Render PostgreSQL dialect in `database.py`**
   - Add `.replace("postgres://", "postgresql://", 1)` for Render database strings.

### P1 — Fix before integration & deployment
4. **Configure Netlify Proxy & Render Startup Script**
   - Add `netlify.toml` in `frontend/` to proxy `/api/*` to Render.
   - Verify `api.js` can read `import.meta.env.VITE_API_URL` when provided.
5. **Fix CORS Configuration in `main.py`**
   - Set `allow_credentials=False` or specify explicit origins to avoid browser CORS errors.
6. **Fix Transaction Mutation in `transactions.py`**
   - Stop mutating baseline `user.monthly_income` directly on transaction insert to avoid compound double-counting.
7. **Fix `ProgressBar.jsx` Division-by-Zero Guard**
   - Prevent `NaN%` width when target is zero.

### P2 — Nice to fix (Time permitting)
8. **Add audio feedback / visual cue for Speech-to-Text active state.**
9. **Add multi-language selector toggle (English / Hindi / Telugu) in header.**

### P3 — Ignore for hackathon
- Do not build complex JWT / OAuth / SMS OTP login. The 1-tap demo + local session is ideal for judging.
- Do not migrate to Next.js or heavy state managers (Redux).
- Do not build complex database migration scripts (Alembic); `Base.metadata.create_all()` in lifespan is sufficient.

---

# 10. 🟢 Final Go / No-Go Assessment

### 1. Can we safely build the MVP on this foundation?
**YES (🟢 GO).** The codebase has a clean separation of concerns, deterministic financial calculation logic, verified government scheme data, accessibility features, and a high-quality UI shell.

### 2. What MUST be fixed first?
1. Remove the committed `backend/venv` directory, add a root `.gitignore`, and set up a clean local environment (`pip install -r requirements.txt` and `npm install`).
2. Fix the duplicate `AskSakhiModal` state in `App.jsx` / `Layout.jsx`.
3. Add the `postgres://` -> `postgresql://` string sanitizer in `database.py`.

### 3. What can safely be ignored during the hackathon?
- Complex user authentication / password hashing / JWT / SMS OTP.
- Database migrations tooling (Alembic).
- Redux / complex state management rewrites.
- Converting tab navigation to complex URL routers.

### 4. What architectural decisions should we lock before feature development?
1. **Math Authority**: All financial calculations (surplus, emergency fund, goal monthly savings, journey progression) remain 100% deterministic inside [`financial_engine.py`](file:///c:/Users/sivap/Desktop/Projects/SW/backend/app/services/financial_engine.py).
2. **AI Role**: The AI service ([`ai_service.py`](file:///c:/Users/sivap/Desktop/Projects/SW/backend/app/services/ai_service.py)) only explains structured numbers and never calculates finances independently.
3. **API Keys**: Private AI keys (`GEMINI_API_KEY`, `OPENAI_API_KEY`) remain strictly backend-only.
4. **Demo Persona**: Preserve the **Lakshmi** 1-tap demo profile to ensure seamless evaluation.
