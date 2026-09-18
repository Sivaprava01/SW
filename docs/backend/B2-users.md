# B2 — User Management, Demographic Profiles & SHG Attributes

## Status: IMPLEMENTED & VERIFIED ✅

### Specification & Architecture Alignment
B2 establishes the user profile domain, regional demographic personalization (state, district, rural/urban locality), language preference (`te`, `hi`, `en`), Self-Help Group (SHG) membership attributes, and baseline financial snapshot onboarding.

### Implemented Components

1. **SQLAlchemy ORM Model (`app/models/user.py`)**:
   - `User` entity mapped to `users` table with indexed `id` and `phone_number`.
   - Demographic fields: `name`, `age`, `gender`, `state`, `district`, `locality_type`, `primary_language`.
   - SHG and livelihood attributes: `is_shg_member`, `shg_name`, `occupation`.
   - Baseline financial figures captured at onboarding: `monthly_income`, `monthly_expenses`, `initial_savings`, `initial_debt`.
   - Timestamps: `created_at`, `updated_at` via `TimestampMixin`.
2. **Pydantic v2 Schemas (`app/schemas/user.py`)**:
   - `UserBase`, `UserCreate`, `UserUpdate`, `UserResponse`, and `UserPreferencesUpdate`.
   - Strict validation constraints (age $\ge 14$, non-negative financial inputs).
3. **Service Layer (`app/services/user_service.py`)**:
   - `create_user`, `get_user_by_id`, `get_user_by_phone`, `list_users`, `update_user`, `delete_user`.
   - `get_or_create_demo_user` auto-seeding the standardized Lakshmi reference profile for instant evaluation.
4. **API Endpoints (`app/api/v1/endpoints/users.py`)**:
   - `POST /api/v1/users` (201 Created)
   - `GET /api/v1/users/demo/lakshmi` (200 OK)
   - `GET /api/v1/users/{id}` (200 OK / 404)
   - `PATCH /api/v1/users/{id}` (200 OK / 404)
   - `DELETE /api/v1/users/{id}` (204 No Content / 404)
   - `GET /api/v1/users` (200 OK with pagination)
5. **Database Migration (`alembic/versions/2026_09_18_2303-8c2b956f087f_create_users_table.py`)**:
   - Creates the `users` table with appropriate columns and indexes.
6. **Automated Test Suite (`tests/test_users.py`)**:
   - 8 dedicated unit & integration tests covering creation, validation, fetching, updating, deletion, pagination, and demo Lakshmi seeding.
   - All tests passing with 100% success rate.

### Verification Command
```bash
uv run pytest -v
```

### Strict Phase Discipline
- B2 implements exclusively user profiles & demographics.
- Financial transactions, calculation engines, savings goals, government schemes, AI chat, and voice are preserved for their respective phases (B3–B9).
