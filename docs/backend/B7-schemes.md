# Phase B7 — Government & SHG Welfare Schemes Matching Engine

## 🎯 Phase Objective
Implement the deterministic Government & SHG Welfare Schemes catalog, eligibility matching engine, and user bookmark/application lifecycle tracking for Sakhi backend.

---

## 🏛️ Architecture & Components Implemented

### 1. Database Models (`app/models/scheme.py`)
- **`GovernmentScheme`** (`government_schemes` table):
  - Stores verified Central and State welfare programs (PMSBY, PMJJBY, MSSC, Stree Nidhi, PM Mudra, Ayushman Bharat, Post Office RD, APY, PM SVANidhi, PM Vishwakarma, Sukanya Samriddhi, Velugu SHG).
  - Attributes: `slug`, `name`, `short_name`, `category`, `jurisdiction`, `benefit_amount_display`, `cost_or_premium`, `min_age`, `max_age`, `gender_eligibility`, `rural_urban`, `requires_shg`, `max_annual_income`, `what_it_provides`, `target_beneficiaries`, `required_documents_json`, `offline_application_process`, `official_portal_url`.
- **`UserSchemeBookmark`** (`user_scheme_bookmarks` table):
  - Tracks user-saved schemes and multi-stage application progression (`discovered` → `applied` → `enrolled` → `dismissed`).
  - Cascades on user or scheme deletion.

### 2. Deterministic Matching Engine (`app/services/scheme_matcher.py`)
- Evaluates 6 deterministic socioeconomic & demographic dimensions:
  1. **Age Bracket**: `min_age <= user.age <= max_age`
  2. **Gender Alignment**: `female_only`, `male_only`, or `all`
  3. **Locality Type**: `rural`, `urban`, or `all`
  4. **SHG Membership**: requires active SHG affiliation or open to individuals
  5. **Jurisdiction / State**: `Central`, `All States`, or state-specific (`Telangana`, etc.)
  6. **Income Ceiling**: `(user.monthly_income * 12) <= max_annual_income`
- Produces exact `match_score` (100% for full eligibility), `is_eligible` bool, itemized `eligibility_reasons`, and actionable `missing_requirements`.

### 3. API Endpoints (`app/api/v1/endpoints/schemes.py`)
- `GET /api/v1/schemes` — Filterable catalog (by category, jurisdiction, SHG requirement, full-text search).
- `GET /api/v1/schemes/{scheme_id_or_slug}` — Comprehensive scheme details, document checklist, offline application guide.
- `GET /api/v1/users/{user_id}/schemes/matched` — User-specific matched schemes sorted by eligibility score with application status.
- `POST /api/v1/users/{user_id}/schemes/{scheme_id}/bookmark` — Bookmark and advance application status.
- `GET /api/v1/users/{user_id}/schemes/bookmarked` — List active user bookmarks.

### 4. Database Migration
- `alembic/versions/2026_09_18_2342-d4e5f6a7b8c9_create_government_schemes_tables.py`

---

## 🧪 Automated Test Suite (`tests/test_schemes.py`)
- **49/49 backend tests passing**.
- Validated:
  - 15 authentic schemes auto-seeded.
  - Multi-parameter filtering and full-text search.
  - Persona matching for **Lakshmi Devi** (100% eligibility on PMSBY, PMJJBY, MSSC, Stree Nidhi, Ayushman Bharat).
  - Disqualification detection on age limits, income ceilings, gender restrictions, and SHG prerequisites.
  - Bookmark creation, lifecycle updates, and 404 error envelopes.
