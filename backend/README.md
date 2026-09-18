# Sakhi Backend — Architecture, PostgreSQL, Authentication & Gemini Guide

Welcome to the **Sakhi Backend**. This backend provides deterministic financial calculation engines, authentic government scheme matching, secure authentication infrastructure, and a dedicated Google Gemini financial assistant.

---

## 1. PostgreSQL Setup

PostgreSQL is the primary production database for Sakhi.

### A. PostgreSQL Installation
- **Ubuntu/Debian**:
  ```bash
  sudo apt update && sudo apt install postgresql postgresql-contrib
  sudo systemctl start postgresql
  ```
- **macOS (Homebrew)**:
  ```bash
  brew install postgresql@16
  brew services start postgresql@16
  ```
- **Windows**:
  Download and install PostgreSQL from the official enterprise installer: [https://www.postgresql.org/download/windows/](https://www.postgresql.org/download/windows/)

### B. Database Creation
Create the `sakhi` database and application user:
```sql
CREATE USER sakhi_user WITH PASSWORD 'your_secure_password';
CREATE DATABASE sakhi OWNER sakhi_user;
GRANT ALL PRIVILEGES ON DATABASE sakhi TO sakhi_user;
```

### C. Configure DATABASE_URL
In `backend/.env`:
```env
DATABASE_URL=postgresql://sakhi_user:your_secure_password@localhost:5432/sakhi
ENVIRONMENT=production
```

> **Note on Failures in Production**: When `ENVIRONMENT=production`, the backend strictly enforces PostgreSQL connectivity and will not silently fall back to SQLite. In `development` or `test` modes, an explicit fallback or `sqlite:///./sakhi.db` configuration is permitted.

### D. Running Migrations
Alembic manages all database migrations:
```powershell
# From backend/ directory
.\venv\Scripts\alembic.exe upgrade head
```
To check current migration status:
```powershell
.\venv\Scripts\alembic.exe current
```

### E. Starting the Backend Server
```powershell
.\venv\Scripts\uvicorn.exe app.main:app --host 127.0.0.1 --port 8000 --reload
```

---

## 2. Authentication Backend

Sakhi includes a complete, production-ready authentication and authorization foundation built independently of the frontend.

### A. Architecture Overview
```
Client Request
  ├──> [Rate Limiter (Sliding Window)] ──> 429 Too Many Requests
  ├──> [Auth Router /api/auth/*]
  │       ├── POST /register  (Validates input, hashes with bcrypt, issues JWT + Refresh)
  │       ├── POST /login     (Verifies password against hash, issues fresh session)
  │       ├── POST /refresh   (Rotates refresh token, invalidates old token)
  │       ├── POST /logout    (Revokes session in database)
  │       └── GET  /me        (Requires Bearer access token, returns safe profile)
  └──> [Protected Dependencies]
          ├── get_current_user / require_authenticated_user
          ├── require_role("ADMIN" / "USER")
          └── check_resource_owner(resource_user_id)
```

### B. Password Security
- Passwords are encrypted using **bcrypt** with random salt rounds ($2b$).
- Plaintext passwords and raw hashes are **never logged**.
- Implemented in `app/core/security.py`:
  - `hash_password(plain_password: str) -> str`
  - `verify_password(plain_password: str, hashed_password: str) -> bool`

### C. JWT Structure
Signed access tokens use the `HS256` algorithm with `JWT_SECRET`. 
The payload contains **only** necessary identity and lifecycle claims:
```json
{
  "sub": "33f12c79-ccf9-4474-b015-3dec94fad103",
  "role": "USER",
  "jti": "e4a2c1b89df0512a",
  "iat": 1740000000,
  "exp": 1740003600
}
```
> **Security Rule**: No passwords, financial amounts, transactions, or sensitive profile metrics are ever embedded inside JWTs.

### D. Refresh Token & Session Management
- Tokens are generated as 64-character high-entropy cryptographic strings (`secrets.token_urlsafe(64)`).
- Only the **SHA-256 hash** of the token is stored in the `refresh_tokens` database table.
- **Single-Use Rotation**: Refreshing an access token automatically revokes the old refresh token and issues a new one. Attempting to reuse an old refresh token is immediately rejected.
- **Revocation**: Logging out marks the token revoked with `revoked_at = timestamp`.

### E. Rate Limiting
Authentication and AI endpoints are guarded by a sliding-window rate limiter:
- `POST /api/auth/login` (configurable via `LOGIN_RATE_LIMIT`, default: 5/min)
- `POST /api/auth/register` (configurable via `REGISTER_RATE_LIMIT`, default: 3/min)
- `POST /api/auth/refresh` (configurable via `REFRESH_RATE_LIMIT`, default: 10/min)
- `POST /api/ai/chat` (configurable via `AI_RATE_LIMIT` & `AI_RATE_WINDOW_SECONDS`, default: 10/min)

---

## 3. Gemini Setup

Sakhi uses Google's official `google-genai` SDK to power its text-based financial companion.

### Step-by-Step Instructions:
1. Open **Google AI Studio** at [https://aistudio.google.com/](https://aistudio.google.com/).
2. Create a Gemini API key.
3. Copy the key.
4. Put it in `backend/.env`:
   ```env
   AI_PROVIDER=gemini
   GEMINI_API_KEY=your_actual_gemini_api_key_here
   GEMINI_MODEL=gemini-2.5-flash
   ```
5. Configure `GEMINI_MODEL` (recommended: `gemini-2.5-flash`).
6. Restart the backend:
   ```powershell
   .\venv\Scripts\uvicorn.exe app.main:app --host 127.0.0.1 --port 8000 --reload
   ```

> [!CAUTION]
> **CRITICAL SECURITY WARNING**:
> The Gemini API key must exist **ONLY** in `backend/.env`.
> Never expose it to the frontend, never place it in frontend environment variables, `localStorage`, `sessionStorage`, API responses, client source code, or GitHub commits.

---

## 4. Running Backend Tests

Run all security and authentication tests:
```powershell
.\venv\Scripts\python.exe test_auth_and_security.py
```

Run financial calculation and deterministic engine tests:
```powershell
.\venv\Scripts\python.exe test_financial_engine.py
```
