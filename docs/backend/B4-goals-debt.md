# B4 — Goal Planning, Savings Tracking & Debt Snowball Logic

## Status: IMPLEMENTED & VERIFIED ✅

### Specification & Architecture Alignment
B4 establishes deterministic goal planning, deposit tracking, monthly required savings computations, debt interest drain accounting, and the automated SHG refinancing arbitrage & snowball payoff engine.

### Implemented Components

1. **SQLAlchemy ORM Models**:
   - `Goal` (`app/models/goal.py`): `name`, `target_amount`, `current_amount`, `target_months`, `target_date`, `category`, `priority`, `is_completed`.
   - `Debt` (`app/models/debt.py`): `lender_name`, `lender_type` (moneylender, shg, bank, family_friend), `principal_amount`, `current_balance`, `monthly_interest_rate`, `annual_interest_rate`, `monthly_emi_payment`, `is_cleared`.
2. **Pydantic v2 Schemas**:
   - `GoalBase`, `GoalCreate`, `GoalUpdate`, `GoalDepositRequest`, `GoalResponse` (with deterministic computed fields: `remaining_amount`, `progress_percentage`, `required_monthly_savings`).
   - `DebtBase`, `DebtCreate`, `DebtUpdate`, `DebtResponse`, `DebtSnowballItem`, `DebtSnowballAnalysisResponse`.
3. **Deterministic Mathematical Engines**:
   - **Goal Math**:
     $$\text{Remaining} = \max(0, \text{Target} - \text{Current}), \quad \text{Progress} = (\text{Current} / \text{Target}) \times 100$$
     $$\text{Required Monthly Savings} = \text{Remaining} / \max(1, \text{Target Months})$$
   - **Monthly Interest Drain**:
     $$\text{Total Interest Drain} = \sum (\text{Current Balance} \times \frac{\text{Monthly Interest Rate}}{100})$$
   - **Subsidized SHG Refinancing Savings**:
     $$\text{Monthly Refinance Savings} = \text{Moneylender Monthly Interest} - \text{SHG 12\% APR Monthly Interest}$$
   - **Payoff Sequences**: Snowball ranking (smallest balance first) and Avalanche ranking (highest APR first).
4. **Service Layers**:
   - `GoalService` (`app/services/goal_service.py`): Goal lifecycle, deposits, progress updates, auto-completion.
   - `DebtService` (`app/services/debt_service.py`): Debt management, interest drain, refinancing analysis, localized plain-language advice.
5. **API Endpoints**:
   - `POST /api/v1/users/{user_id}/goals`
   - `GET /api/v1/users/{user_id}/goals`
   - `GET /api/v1/users/{user_id}/goals/{goal_id}`
   - `POST /api/v1/users/{user_id}/goals/{goal_id}/deposit`
   - `PATCH /api/v1/users/{user_id}/goals/{goal_id}`
   - `DELETE /api/v1/users/{user_id}/goals/{goal_id}`
   - `POST /api/v1/users/{user_id}/debts`
   - `GET /api/v1/users/{user_id}/debts`
   - `GET /api/v1/users/{user_id}/debts/{debt_id}`
   - `PATCH /api/v1/users/{user_id}/debts/{debt_id}`
   - `DELETE /api/v1/users/{user_id}/debts/{debt_id}`
   - `GET /api/v1/users/{user_id}/debts-analysis/snowball`
6. **Database Migration (`alembic/versions/2026_09_18_2317-b2c3d4e5f6a7_create_goals_and_debts_tables.py`)**:
   - Generates and migrates `goals` and `debts` tables.
7. **Automated Test Suites**:
   - `tests/test_goals.py` (4 tests)
   - `tests/test_debt.py` (4 tests)
   - Total backend suite: 28 passing tests.

### Verification Command
```bash
uv run pytest -v
```

### Strict Phase Discipline
- B4 strictly covers Goals, Micro-Savings, and Debt Snowball Refinancing.
- Financial knowledge/calculators (B5), learning progression (B6), government schemes (B7), AI chat (B8), and voice (B9) are preserved for subsequent phases.
