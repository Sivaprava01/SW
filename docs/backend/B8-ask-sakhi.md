# Phase B8 — Ask Sakhi AI Companion, Grounding & Safety Guardrails

## 🎯 Phase Objective
Implement the conversational **Ask Sakhi AI Companion** engine with real-time deterministic financial grounding, strict safety guardrails, Indic multi-language prompt engineering (English, Telugu, Hindi), and conversational API endpoints.

---

## 🏛️ Architecture & Components Implemented

### 1. Financial Grounding Engine (`app/services/ai_context_builder.py`)
- Compiles user's live financial data to eliminate AI numeric hallucinations:
  - **Demographics**: Name, Age, Location (Rural/Urban, State), SHG Membership, Occupation.
  - **Live Cashflow**: Monthly Income, Essential Expenses, Disposable Surplus, Savings Ratio.
  - **3-Month Emergency Shield Buffer**: Current savings vs. benchmark living expense reserve (₹21,000 for ₹7,000/mo expenses).
  - **Active Debt Obligations**: Current balance, moneylender monthly interest drain (36%–60% APR), and potential SHG refinancing savings (12% APR).
  - **Savings Goals**: Active goals, target amounts, saved amounts, remaining targets.
  - **7-Stage Roadmap**: Active stage on the Financial Freedom Journey.
  - **Matched Government Schemes**: 100% eligible welfare programs (PMSBY, PMJJBY, Stree Nidhi, MSSC, Mudra, etc.).

### 2. Safety Guardrails & System Prompts (`app/services/ai_guardrails.py`)
- **Multilingual System Prompts**: Authentic, culturally resonant system prompts in English, Telugu, and Hindi creating the warm, knowledgeable elder sister ("Sakhi Didi") persona.
- **Financial Hierarchy**:
  1. Build 3-month emergency safety buffer.
  2. Escape high-interest private moneylender debt through SHG refinancing / snowball repayment.
  3. Enroll in government micro-insurance (PMSBY ₹20/yr, PMJJBY ₹436/yr) and welfare programs.
  4. Disciplined savings into Post Office Recurring Deposits (PORD) or productive livelihood assets.
- **Anti-Speculation Filter**: Automatic detection and rejection of cryptocurrency, lotteries, gambling, intraday stock trading, or unregulated private chit funds.

### 3. AI Companion Service (`app/services/ai_service.py`)
- **`AIService.chat`**: Invokes Google Gemini API with system instructions and grounding prompt; falls back seamlessly to a rich deterministic grounded reasoning engine when offline.
- **`AIService.explain_concept`**: Provides simplified, conversational Indic explanations for core financial literacy concepts and Golden Rules.

### 4. API Endpoints (`app/api/v1/endpoints/ai.py`)
- `POST /api/v1/ai/chat` — Conversational interaction with Ask Sakhi AI.
- `GET /api/v1/ai/grounding/{user_id}` — Inspect live financial metrics compiled for AI grounding.
- `POST /api/v1/ai/explain` — Universal Concept Explainer.

---

## 🧪 Automated Test Suite (`tests/test_ai.py`)
- **57/57 backend tests passing**.
- Validated:
  - Gathering live grounding metrics for persona Lakshmi.
  - Strict blocking and safe guidance on speculative queries (crypto/gambling).
  - Multilingual chat responses in English, Telugu, and Hindi with exact figures.
  - Identification of moneylender interest drains and SHG refinancing advice.
  - Surfacing matched government welfare programs.
  - Universal Concept Explainer and Golden Rule linkage.
  - 404 error handling for missing users and unknown concepts.
