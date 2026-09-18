# Sakhi (సఖి / सखी) — Functional & Technical Feature Specification

Sakhi is an AI-powered, Indic-first financial companion platform built specifically for rural and semi-urban women, Self-Help Group (SHG) members, and micro-entrepreneurs in India. It bridges the critical gap in financial literacy, informal debt management, government scheme accessibility, and goal-based savings through deterministic mathematical financial engines, localized Indic AI assistance, and voice-assisted interactions.

---

## 1. Core Mission & Problem Domain

1. **Informal Debt Traps**: Rural women frequently borrow from private moneylenders at 36%–60% annual interest rates (3%–5% monthly). Sakhi provides mathematical debt-snowball and SHG refinancing strategies to eliminate high-interest liabilities.
2. **Lack of Emergency Reserves**: Household shocks (e.g., medical emergencies, crop loss, livestock illness) cause immediate distress. Sakhi guides users to build a 3-month basic living expense safety shield.
3. **Information Asymmetry in Government Schemes**: Dozens of central, state, and SHG welfare schemes (e.g., PMSBY, PMJJBY, MSSC, Stree Nidhi, PM Mudra) remain underutilized due to jargon and complex rules. Sakhi provides deterministic eligibility matching.
4. **Low Text & Banking Literacy**: Traditional banking interfaces are text-heavy and full of financial jargon. Sakhi operates through voice narration, Indic speech-to-text, and conversational AI in Telugu, Hindi, and English.

---

## 2. Deterministic Financial Health & Cashflow Engine

The core financial calculation engine operates deterministically to analyze user finances without speculative or hallucinated figures.

### Key Financial Calculations & Metrics:
- **True Monthly Disposable Surplus**:
  $$\text{Surplus} = \max(0, \text{Monthly Income} - \text{Monthly Essential Expenses})$$
- **Emergency Safety Buffer Target**:
  $$\text{Emergency Target} = \text{Monthly Essential Expenses} \times 3$$
  *(Calculates the precise amount needed to protect the family from private moneylenders during crises).*
- **Emergency Progress Percentage**:
  $$\text{Emergency Progress} = \min\left(100, \left(\frac{\text{Current Total Savings}}{\text{Emergency Target}}\right) \times 100\right)$$
- **Debt-to-Income & Interest Drain**:
  - Computes monthly interest drain comparing informal moneylender loans (36%–60% APR) against subsidized SHG / Stree Nidhi credit (7%–12% APR).
  - Calculates the exact monthly rupees saved by refinancing private debt into institutional SHG loans.
- **Savings Allocation Accounting**:
  - Tracks **Total Savings**, **Allocated Goal Savings**, and **Unallocated / Liquid Emergency Reserves**:
    $$\text{Unallocated Savings} = \max(0, \text{Total Savings} - \text{Sum of All Goal Deposits})$$
- **Financial Health Status Categorization**:
  - `Healthy Surplus`: Monthly expenses are $\le 70\%$ of income, leaving $\ge 30\%$ surplus for savings and debt clearance.
  - `Tight Budget`: Surplus is between $5\%$ and $29\%$ of income, requiring conservative allocation.
  - `Negative Cashflow / Deficit`: Monthly expenses exceed income, triggering immediate expense audit and debt relief advice.

---

## 3. 7-Stage Financial Empowerment Journey Engine

A structured roadmap that guides users through progressive financial milestones, unlocking achievements based on real financial data:

1. **Stage 1 — Daily Cashflow & Awareness**:
   - Tracking daily income sources (tailoring, dairy sales, agricultural wages, micro-retail) and household expenses.
2. **Stage 2 — Emergency Shield**:
   - Accumulating a 3-month kitchen and living expense buffer in a safe formal institution (Post Office savings or bank account with ATM).
3. **Stage 3 — High-Cost Debt Elimination**:
   - Eliminating high-interest moneylender loans using the debt snowball method and SHG credit refinancing.
4. **Stage 4 — Habitual Disciplined Saving**:
   - Establishing automated "Pay-Yourself-First" recurring deposits (RD) or weekly SHG pot contributions immediately on income days.
5. **Stage 5 — Social Security & Micro-Insurance**:
   - Enrolling in foundational government micro-insurance policies (PMSBY for ₹20/year accidental cover, PMJJBY for ₹436/year life cover, Ayushman Bharat).
6. **Stage 6 — Goal-Oriented Wealth Creation**:
   - Accumulating dedicated capital for income-generating micro-businesses (sewing machines, livestock, inventory) and children's higher education.
7. **Stage 7 — Financial Independence & Leadership**:
   - Achieving zero informal debt, 6+ months of reserves, and guiding peer SHG members in community financial literacy circles.

---

## 4. Rule-Based Government & SHG Welfare Scheme Matcher

A deterministic matching algorithm that filters central, state, and federation schemes against user demographic and financial criteria.

### Supported Schemes Database (15+ Active Schemes):
- **Pradhan Mantri Suraksha Bima Yojana (PMSBY)**: ₹2 Lakh accidental insurance for ₹20/year.
- **Pradhan Mantri Jeevan Jyoti Bima Yojana (PMJJBY)**: ₹2 Lakh life insurance for ₹436/year.
- **Mahila Samman Savings Certificate (MSSC)**: 7.5% guaranteed interest fixed deposit for women.
- **Sukanya Samriddhi Yojana (SSY)**: High-interest long-term savings for girl child education.
- **Stree Nidhi Credit Cooperative (AP / Telangana)**: Low-interest micro-credit for SHG women.
- **Velugu / SERP SHG Federation Loans**: Subsidized collective credit for rural women collectives.
- **PM Mudra Yojana (Shishu / Kishor)**: Collateral-free micro-enterprise loans up to ₹10 Lakh.
- **PM SVANidhi**: Working capital micro-loans for street vendors and artisans.
- **Ayushman Bharat (PM-JAY)**: Up to ₹5 Lakh annual secondary/tertiary hospitalization coverage per family.
- **Post Office Recurring Deposit (PORD)**: Government-guaranteed small monthly savings.
- **Atal Pension Yojana (APY)**: Guaranteed monthly pension of ₹1,000–₹5,000 after age 60.

### Matching Engine Parameters:
- Age constraints (`min_age`, `max_age`)
- Gender applicability (`female_only`, `all`)
- Residence criteria (`rural`, `urban`, `all`)
- SHG membership requirement (`is_shg_member == True`)
- State jurisdiction (`Andhra Pradesh`, `Telangana`, `Central / All States`)
- Income eligibility ceilings
- Match scoring output with document checklists and offline bank/panchayat application procedures.

---

## 5. Conversational Indic AI Companion ("Ask Sakhi")

A context-grounded AI financial advisor tailored specifically for rural women, powered by Google Gemini AI with deterministic guardrails.

### Technical & Functional Capabilities:
- **Financial Profile Grounding**:
  - The AI prompt receives real-time user context: verified monthly income, surplus, existing debt, total savings, active goals, state, and SHG status.
- **Strict Financial Guardrails**:
  - Never recommends high-risk investments, speculative stocks, crypto, or unregulated chit funds.
  - Always prioritizes: Emergency buffer $\rightarrow$ Paying off high-interest private moneylenders $\rightarrow$ Low-risk Post Office / Bank RDs $\rightarrow$ Government schemes.
- **Zero Jargon & Culturally Localized Responses**:
  - Explains concepts in everyday rural metaphors (e.g., comparing recurring deposits to safe grain storage).
  - Native multi-turn conversational support in **Telugu**, **Hindi**, and **English**.
- **Preset Rural Financial Prompts**:
  - How to allocate a specific monthly surplus (e.g., ₹4,200).
  - How to replace 3%–5% monthly moneylender loans with 1% SHG loans.
  - Which scheme provides direct capital for tailoring machines or cattle purchases.
  - How to open a Post Office RD account without middlemen.

---

## 6. Indic Multilingual Speech-to-Text & Voice Synthesis Pipeline

- **Multilingual Speech-to-Text (STT)**:
  - Hands-free voice input supporting Indic accents and regional vocabularies in **Telugu (`te-IN`)**, **Hindi (`hi-IN`)**, and **English (`en-IN`)**.
  - Direct speech-to-field population for names, financial figures, and questions.
- **Text-to-Speech (TTS) Voice Guidance**:
  - Audio explainer narration across all financial dashboards, lesson cards, scheme criteria, and AI conversational responses.
  - Seamless speech synthesis queue handling on mobile and desktop browsers with Indic voiceover selection.

---

## 7. Goal Planning & Micro-Savings Allocation System

- **Category-Based Goal Setup**:
  - Education (children's schooling/college)
  - Emergency Shield (household safety reserve)
  - Business / Micro-Enterprise (tailoring machine, retail inventory, livestock)
  - House Repair & Sanitation
  - Healthcare Buffer
  - Gold & Festival Savings
- **Dynamic Savings Plan Calculation**:
  - Computes required monthly deposit based on target amount and target completion timeline (months).
  - Incremental deposit logging against specific goals.
  - Real-time percentage tracking, target completion estimations, and celebration feedback upon goal realization.

---

## 8. Income & Expense Transaction Ledger

- **Micro-Transaction Tracking**:
  - Quick recording of diverse rural income streams (agricultural harvest, daily dairy sales, tailoring orders, seasonal labor, government DBT transfers).
  - Categorization of household expenses (kitchen groceries, medicine, school fees, electricity/fuel, loan interest, festivals/ceremonies).
- **Real-Time Surplus Recalculation**:
  - Automatically updates the user's monthly disposable surplus and dynamic health status when new transactions are logged.

---

## 9. Privacy, Data Safety & Offline Resilience

- **Zero Paperwork & Non-Intrusive Onboarding**:
  - No Aadhaar numbers, PAN cards, or bank account credentials required.
  - Purely localized identity setup focusing solely on mathematical cashflow numbers.
- **Deterministic Storage & Session Management**:
  - Local caching of language preferences, theme settings, and profile state.
  - Fast, read-only backend API interactions with persistent SQLite database schemas.
