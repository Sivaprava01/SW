# Sakhi (सखी) — AI-Powered Financial Companion

> **"Backend calculates → AI explains → User understands"**

Sakhi is an AI-powered financial companion tailored for rural women and people with limited financial literacy. It helps users understand their money, navigate a 7-stage financial freedom journey, plan savings goals with deterministic math, discover authentic government schemes, and converse with a friendly AI assistant grounded strictly in their actual financial numbers.

---

## Architecture & Tech Stack

- **Frontend**: React, Vite, Tailwind CSS, Lucide Icons, Canvas Confetti. Mobile-first design with accessible high contrast and large buttons.
- **Backend**: FastAPI, Python 3.12, Pydantic v2, Uvicorn.
- **Financial Calculation Engine**: `backend/app/services/financial_engine.py` (100% deterministic calculation of surplus, goal monthly requirements, emergency fund metrics, and journey progression).
- **Database**: PostgreSQL with SQLAlchemy ORM (with automatic fallback to SQLite `sqlite:///./sakhi.db` if PostgreSQL credentials require local configuration).
- **AI Integration**: Configurable Gemini API (`google-genai`) or OpenAI API (`openai`) via `AI_PROVIDER` and API keys in `.env`, with a smart grounded deterministic fallback when offline or unconfigured.

---

## Quick Start Guide

### 1. Backend Setup

From the `backend/` directory:

```bash
# 1. Activate virtual environment
# On Windows PowerShell:
.\venv\Scripts\Activate.ps1

# 2. Configure environment (optional - defaults to PostgreSQL with auto SQLite fallback)
cp .env.example .env

# 3. Run FastAPI Backend
uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

The backend will automatically:
- Connect to PostgreSQL (or fall back to SQLite).
- Create all database tables.
- Seed 15 verified authentic Indian government schemes.
- Pre-seed the official demo profile (**Lakshmi**).

Access Swagger API docs at: [http://localhost:8000/docs](http://localhost:8000/docs)

---

### 2. Frontend Setup

From the `frontend/` directory:

```bash
# 1. Install dependencies (already installed in workspace)
npm install

# 2. Start Vite development server
npm run dev
```

Open your browser at: [http://localhost:5173/](http://localhost:5173/)

---

## Recommended Hackathon Demo Flow (Lakshmi)

1. **One-Tap Demo Login**:
   - Open `http://localhost:5173/`.
   - On the Welcome screen, tap **"Instant Demo as Lakshmi"**.
   - Profile loads: **Lakshmi**, Age 28, Telangana, Monthly Income ₹12,000, Expenses ₹7,000, Savings ₹10,000, Debt ₹20,000, Goal: *Daughter's Education (₹50,000)*.

2. **Home Screen**:
   - Greeted by *"Namaste, Lakshmi"*.
   - See **Income: ₹12,000** and **Calculated Surplus: ₹5,000**.
   - Large touch-friendly primary action buttons: Ask Sakhi, My Money, Journey, Goals, Benefits, and Learn.

3. **My Money (Financial Health & Transactions)**:
   - Tap **My Money**.
   - View cards: Income (₹12,000), Expenses (₹7,000), Monthly Surplus (₹5,000), Savings (₹10,000), and Debt Alert (₹20,000).
   - View Emergency Fund (Suraksha Kavach) progress: ₹10,000 / ₹21,000 (47.6% safe).
   - Tap **"Log Entry"** to add ₹1,500 (Vegetable Sales) or ₹500 (Groceries).
   - Watch the backend instantly recalculate monthly income and surplus without page reload!

4. **Financial Journey**:
   - Tap **Journey**.
   - View the 7-stage roadmap:
     1. Track Income & Expenses (Completed)
     2. **Build Emergency Fund (Current Active)** — Target: ₹21,000 (3 months expenses).
     3. Manage & Clear Debt (Next Milestone).
     4. Build Savings
     5. Protect Family
     6. Long-Term Investing
     7. Financial Independence

5. **My Goals**:
   - Tap **Goals**.
   - Inspect **Daughter's Education**:
     - Target: ₹50,000 | Saved: ₹10,000 (20%).
     - Remaining: ₹40,000 over 12 months.
     - **Deterministic Required Monthly Saving**: **₹3,334 / month**.
   - Tap **"+ Add ₹"** to add savings (e.g., ₹40,000) to trigger celebratory confetti!

6. **Ask Sakhi AI (Voice & Text Chat)**:
   - Tap **Talk to Sakhi** on the top or bottom of the screen.
   - Click sample question chip: *"I have ₹20,000 debt. What should I do?"* or *"How much should I save every month?"*.
   - Notice Sakhi references Lakshmi's exact **₹5,000 surplus**, **₹20,000 debt**, and **₹3,334 monthly savings requirement** without hallucinating or altering calculations.
   - Tap the **"Listen"** button to hear speech synthesis.

7. **Benefits & Scheme Matcher**:
   - Tap **Benefits**.
   - Browse 15 well-researched Central and Telangana schemes (PMMY Mudra, Lakhpati Didi, Stree Nidhi, MSSC, SSY, PMSBY, PMJJBY, APY, PM SVANidhi, PMAY-G, PM Vishwakarma).
   - Tap **"Run Matcher"** with Lakshmi's profile (Woman, 28, Telangana, Low Income, Small Business / SHG).
   - Observe 100% matched programs with clear reasons and the mandatory disclaimer:
     > *"Sakhi provides a preliminary eligibility match and does not provide official eligibility confirmation."*
   - Tap **"Details & Source"** on any scheme to view documents needed, how to apply, and click out to the **Official Government Portal**.

---

## Security & AI Safety

- API keys are stored only in backend `.env` variables and never exposed to the client.
- The AI system prompt strictly forbids independent math calculations; backend-generated figures are authoritative.
- The scheme matcher enforces non-promotional, preliminary advisory disclaimers on every match.
- If AI APIs are offline or unconfigured, the application gracefully provides intelligent deterministic explanations using actual user metrics without crashing.
