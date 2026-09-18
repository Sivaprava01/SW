# Sakhi React Native ↔ FastAPI API Integration Map (Phase I0 Audit)

> **Document Status**: Complete (Phase I0 Audit)  
> **Source of Truth (Backend)**: FastAPI Backend (`backend/app/api/v1/`) — **100% READ-ONLY**  
> **Source of Truth (Frontend)**: React Native / Expo Application (`frontend/`)

---

## 1. System Overview & Architecture Rules

* **Frontend Location**: `frontend/` (React Native 0.86.3, Expo SDK 57, Expo Router 57, NativeWind 4).
* **Backend Location**: `backend/` (FastAPI, SQLAlchemy, Pydantic v2, Google Gemini, gTTS).
* **Legacy Web Archive**: `frontend-web-archive/` (Archived React/Vite web application — Inactive reference only).
* **Golden Constraint**: The backend is **100% READ-ONLY**. No backend files, routes, schemas, models, migrations, or Python code will be altered. The React Native frontend must strictly adapt to the existing backend API contracts.
* **Security Rule**: The mobile frontend never directly accesses the Gemini API or stores the Gemini API key. All AI, grounding, and STT requests route through FastAPI.

---

## 2. Complete FastAPI API Contract Inventory

The FastAPI backend exposes 13 domain routers aggregated under the `/api/v1` prefix:

### 2.1 Health & Diagnostics
* **`GET /api/v1/health`**
  * **Summary**: Liveness Probe
  * **Response**: `HealthResponse` (`status: str`, `app: str`, `version: str`, `environment: str`, `timestamp: datetime`)
* **`GET /api/v1/health/ready`**
  * **Summary**: Readiness Probe
  * **Response**: `ReadinessResponse` (`status: str`, `database: str`, `app: str`, `version: str`, `timestamp: datetime`)
* **`GET /api/v1/health/metrics`**
  * **Summary**: System Diagnostics & Metrics
  * **Response**: `MetricsResponse` (`app: str`, `version: str`, `uptime_seconds: float`, `database_status: str`, `ai_provider: str`, `voice_tts_provider: str`, `timestamp: datetime`)

### 2.2 Users & Personalization (Prefix: `/api/v1/users`)
* **`POST /api/v1/users`** (Status 201)
  * **Request**: `UserCreate` (`name`, `phone_number?`, `age=25`, `gender="female"`, `state="Telangana"`, `district?`, `locality_type="rural"`, `primary_language="te"`, `is_shg_member=False`, `shg_name?`, `occupation="Tailoring"`, `monthly_income=0.0`, `monthly_expenses=0.0`, `initial_savings=0.0`, `initial_debt=0.0`)
  * **Response**: `UserResponse` (`id: int`, `created_at: datetime`, `updated_at: datetime`, + `UserBase` fields)
* **`GET /api/v1/users/demo/lakshmi`** (Status 200)
  * **Summary**: Get or initialize reference Lakshmi demo profile (`id: int`, `name: "Lakshmi Devi"`, `age: 28`, `state: "Telangana"`, `is_shg_member: true`, `monthly_income: 18500.0`, `monthly_expenses: 14300.0`, `initial_savings: 18000.0`, `initial_debt: 12000.0`)
  * **Response**: `UserResponse`
* **`GET /api/v1/users/{user_id}`** (Status 200)
  * **Response**: `UserResponse` (or 404 if not found)
* **`PATCH /api/v1/users/{user_id}`** (Status 200)
  * **Request**: `UserUpdate` (all fields optional)
  * **Response**: `UserResponse`
* **`DELETE /api/v1/users/{user_id}`** (Status 204)
  * **Response**: None
* **`GET /api/v1/users?skip=0&limit=50`** (Status 200)
  * **Response**: `List[UserResponse]`

### 2.3 Transactions & Cashflow (Prefix: `/api/v1`)
* **`POST /api/v1/users/{user_id}/transactions`** (Status 201)
  * **Request**: `TransactionCreate` (`amount: float > 0`, `type: "income" | "expense"`, `category: str`, `date: date`, `description?: str`)
  * **Response**: `TransactionResponse` (`id: int`, `user_id: int`, `amount: float`, `type: str`, `category: str`, `date: date`, `description?: str`, `created_at: datetime`, `updated_at: datetime`)
* **`GET /api/v1/users/{user_id}/transactions?type=income|expense&skip=0&limit=50`** (Status 200)
  * **Query Params**: `type?: "income" | "expense"`, `skip=0`, `limit=50`
  * **Response**: `List[TransactionResponse]`
* **`DELETE /api/v1/users/{user_id}/transactions/{transaction_id}`** (Status 204)
  * **Response**: None

### 2.4 Financial Health Summary (Prefix: `/api/v1`)
* **`GET /api/v1/users/{user_id}/financial-health`** (Status 200)
  * **Summary**: Full deterministic financial health evaluation
  * **Response**: `FinancialSummaryResponse`
    * `user_id: int`, `user_name: str`, `primary_language: str`
    * `monthly_income: float`, `monthly_expenses: float`, `monthly_surplus: float`
    * `savings_ratio: float`, `expense_ratio: float`
    * `total_savings: float`, `total_debt: float`
    * `emergency_target: float` (3 months expenses), `emergency_progress_percentage: float`
    * `health_status: "Healthy Surplus" | "Tight Budget" | "Negative Cashflow / Deficit"`
    * `health_summary: str` (Jargon-free summary)
    * `expense_breakdown: List[CategoryBreakdown]`, `income_breakdown: List[CategoryBreakdown]`

### 2.5 Goals & Savings Planning (Prefix: `/api/v1`)
* **`POST /api/v1/users/{user_id}/goals`** (Status 201)
  * **Request**: `GoalCreate` (`name: str`, `target_amount: float > 0`, `current_amount: float = 0.0`, `target_months: int = 12`, `target_date?: date`, `category: str = "General Savings"`, `priority: int = 1`)
  * **Response**: `GoalResponse` (`id: int`, `user_id: int`, `remaining_amount: float`, `progress_percentage: float`, `required_monthly_savings: float`, `is_completed: bool`, `created_at`, `updated_at`)
* **`GET /api/v1/users/{user_id}/goals`** (Status 200)
  * **Response**: `List[GoalResponse]`
* **`GET /api/v1/users/{user_id}/goals/{goal_id}`** (Status 200)
  * **Response**: `GoalResponse`
* **`POST /api/v1/users/{user_id}/goals/{goal_id}/deposit`** (Status 200)
  * **Request**: `GoalDepositRequest` (`amount: float > 0`)
  * **Response**: `GoalResponse` (Automatically updates savings balance and marks `is_completed: true` if target achieved)
* **`PATCH /api/v1/users/{user_id}/goals/{goal_id}`** (Status 200)
  * **Request**: `GoalUpdate`
  * **Response**: `GoalResponse`
* **`DELETE /api/v1/users/{user_id}/goals/{goal_id}`** (Status 204)
  * **Response**: None

### 2.6 Debt Management & Snowball Analysis (Prefix: `/api/v1`)
* **`POST /api/v1/users/{user_id}/debts`** (Status 201)
  * **Request**: `DebtCreate` (`lender_name: str`, `lender_type: "moneylender" | "shg" | "bank" | "family_friend"`, `principal_amount: float`, `current_balance: float`, `monthly_interest_rate: float = 3.0`, `annual_interest_rate?: float`, `monthly_emi_payment: float = 0.0`, `is_cleared: bool = False`, `notes?: str`)
  * **Response**: `DebtResponse` (`id: int`, `user_id: int`, `monthly_interest_drain: float`, `created_at`, `updated_at`)
* **`GET /api/v1/users/{user_id}/debts`** (Status 200)
  * **Response**: `List[DebtResponse]`
* **`GET /api/v1/users/{user_id}/debts/{debt_id}`** (Status 200)
  * **Response**: `DebtResponse`
* **`PATCH /api/v1/users/{user_id}/debts/{debt_id}`** (Status 200)
  * **Request**: `DebtUpdate`
  * **Response**: `DebtResponse`
* **`DELETE /api/v1/users/{user_id}/debts/{debt_id}`** (Status 204)
  * **Response**: None
* **`GET /api/v1/users/{user_id}/debts-analysis/snowball`** (Status 200)
  * **Response**: `DebtSnowballAnalysisResponse` (`total_debt_balance`, `total_monthly_interest_drain`, `total_monthly_emi`, `informal_debt_balance`, `informal_monthly_interest`, `potential_shg_refinance_monthly_savings`, `potential_annual_refinance_savings`, `debts_snowball_order: List[DebtSnowballItem]`, `debts_avalanche_order: List[DebtSnowballItem]`, `actionable_recommendation: str`)

### 2.7 Deterministic Calculators (Prefix: `/api/v1/calculators`)
* **`POST /api/v1/calculators/emergency-fund`**
  * **Request**: `EmergencyFundCalcRequest` (`monthly_expenses: float`, `months_buffer: int = 3`, `current_savings: float = 0.0`)
  * **Response**: `EmergencyFundCalcResponse` (`emergency_target`, `shortfall`, `progress_percentage`, `safety_rating`, `plan_options: List[EmergencyFundHorizonOption]`, `guidance`)
* **`POST /api/v1/calculators/debt-refinance`**
  * **Request**: `DebtRefinanceCalcRequest` (`loan_amount: float`, `moneylender_monthly_rate: float = 3.0`, `shg_annual_rate: float = 12.0`, `tenure_months: int = 12`)
  * **Response**: `DebtRefinanceCalcResponse` (`monthly_rupees_saved`, `total_tenure_rupees_saved`, `interest_reduction_percentage`, `guidance`)
* **`POST /api/v1/calculators/recurring-deposit`**
  * **Request**: `RDCalcRequest` (`monthly_deposit: float`, `annual_interest_rate: float = 6.7`, `tenure_months: int = 12`)
  * **Response**: `RDCalcResponse` (`total_deposited`, `maturity_amount`, `interest_earned`, `compounding_frequency`, `guidance`)
* **`POST /api/v1/calculators/goal-horizon`**
  * **Request**: `GoalHorizonCalcRequest` (`target_amount`, `current_savings`, `available_monthly_surplus`, `target_months?`)
  * **Response**: `GoalHorizonCalcResponse` (`months_needed`, `recommended_monthly_allocation`, `surplus_utilization_percentage`, `is_feasible_in_target_timeline`, `feasibility_status`, `guidance`)

### 2.8 Financial Knowledge & Golden Rules (Prefix: `/api/v1/knowledge`)
* **`GET /api/v1/knowledge/concepts?category=...`**
  * **Response**: `List[FinancialConceptResponse]` (`id`, `slug`, `category`, `title: LocalizedText`, `summary: LocalizedText`, `plain_language_explanation: LocalizedText`, `practical_action: LocalizedText`, `warning_or_pitfall?: LocalizedText`)
* **`GET /api/v1/knowledge/concepts/{concept_id}`**
  * **Response**: `FinancialConceptResponse`
* **`GET /api/v1/knowledge/golden-rules`**
  * **Response**: `List[GoldenRuleResponse]` (`rule_number`, `rule_key`, `title: LocalizedText`, `short_formula`, `explanation: LocalizedText`, `example: LocalizedText`)

### 2.9 Learning Modules & Lessons (Prefix: `/api/v1`)
* **`GET /api/v1/learning/modules`**
  * **Response**: `List[ModuleResponse]` (`module_id`, `category`, `title: LocalizedText`, `description: LocalizedText`, `icon`, `total_lessons`, `lessons: List[LessonResponse]`)
* **`GET /api/v1/learning/modules/{module_id}`**
  * **Response**: `ModuleResponse`
* **`GET /api/v1/learning/lessons/{lesson_id}`**
  * **Response**: `LessonResponse` (`lesson_id`, `title`, `duration_minutes`, `audio_narration_script: LocalizedText`, `key_takeaways: List[LocalizedText]`, `quiz?: QuizQuestion`)
* **`POST /api/v1/users/{user_id}/learning/lessons/{lesson_id}/complete`**
  * **Request**: `LessonCompleteRequest` (`quiz_score?: int`)
  * **Response**: `UserLessonProgressResponse` (`id`, `user_id`, `module_id`, `lesson_id`, `is_completed`, `quiz_score`, `created_at`, `updated_at`)
* **`GET /api/v1/users/{user_id}/learning/progress`**
  * **Response**: `UserLearningSummaryResponse` (`total_available_lessons`, `completed_lessons_count`, `overall_progress_percentage`, `completed_lesson_ids`)

### 2.10 7-Stage Financial Journey (Prefix: `/api/v1`)
* **`GET /api/v1/users/{user_id}/journey`**
  * **Response**: `JourneyRoadmapResponse` (`user_id`, `current_active_stage`, `completed_stages_count`, `total_stages=7`, `overall_journey_progress_percentage`, `next_milestone_action: LocalizedText`, `stages: List[JourneyStageResponse]`)

### 2.11 Government & Welfare Schemes (Prefix: `/api/v1`)
* **`GET /api/v1/schemes?category=...&jurisdiction=...&requires_shg=...&search=...`**
  * **Response**: `List[SchemeResponse]` (`id`, `slug`, `name`, `short_name`, `category`, `jurisdiction`, `benefit_amount_display`, `cost_or_premium`, `min_age`, `max_age`, `gender_eligibility`, `rural_urban`, `requires_shg`, `description`, `what_it_provides`, `target_beneficiaries`, `required_documents: List[str]`, `offline_application_process`, `official_portal_url`)
* **`GET /api/v1/schemes/{scheme_id_or_slug}`**
  * **Response**: `SchemeResponse`
* **`GET /api/v1/users/{user_id}/schemes/matched`**
  * **Summary**: Deterministic eligibility match evaluated against user demographics
  * **Response**: `List[SchemeMatchResponse]` (+ `match_score: float`, `is_eligible: bool`, `eligibility_reasons: List[str]`, `missing_requirements: List[str]`, `user_application_status?: str`)
* **`POST /api/v1/users/{user_id}/schemes/{scheme_id}/bookmark`**
  * **Request**: `BookmarkRequest` (`is_bookmarked: bool = True`, `application_status: "discovered" | "applied" | "enrolled" | "dismissed"`, `notes?: str`)
  * **Response**: `BookmarkResponse` (`id`, `user_id`, `scheme_id`, `is_bookmarked`, `application_status`, `scheme: SchemeResponse`)
* **`GET /api/v1/users/{user_id}/schemes/bookmarked`**
  * **Response**: `List[BookmarkResponse]`

### 2.12 Ask Sakhi AI Companion (Prefix: `/api/v1/ai`)
* **`POST /api/v1/ai/chat`**
  * **Request**: `AIChatRequest` (`user_id: int`, `message: str`, `language: str = "en"`)
  * **Response**: `AIChatResponse` (`reply: str`, `language: str`, `is_fallback: bool`, `grounding_metrics?: GroundingMetrics`, `suggested_followups: List[str]`)
* **`GET /api/v1/ai/grounding/{user_id}`**
  * **Response**: `GroundingMetrics` (`user_name`, `monthly_income`, `monthly_expenses`, `monthly_surplus`, `savings_ratio_percentage`, `current_savings`, `emergency_fund_target`, `emergency_fund_progress_percentage`, `total_debt`, `monthly_interest_drain`, `active_goals_count`, `current_stage`, `current_stage_title`, `matched_schemes_count`, `is_shg_member`)
* **`POST /api/v1/ai/explain`**
  * **Request**: `ExplainConceptRequest` (`concept_slug: str`, `language: str = "en"`)
  * **Response**: `ExplainConceptResponse` (`concept_slug`, `title`, `explanation`, `practical_example`, `golden_rule?`, `language`)

### 2.13 Voice & Speech (Prefix: `/api/v1/voice`)
* **`GET /api/v1/voice/languages`**
  * **Response**: `SupportedLanguagesResponse` (`languages: List[VoiceLanguage]`, `default_language: "te"`, `total_supported: int`)
* **`POST /api/v1/voice/synthesize`**
  * **Request**: `VoiceSynthesisRequest` (`text: str`, `language: str = "te"`, `speed: float = 1.0`, `audio_format: str = "mp3"`)
  * **Response**: `VoiceSynthesisResponse` (`audio_base64: str`, `audio_format: str`, `duration_seconds: float`, `sample_rate: int`, `character_count: int`, `language: str`, `voice_name: str`, `is_cached: bool`)
* **`GET /api/v1/voice/stream?text=...&language=...&speed=...&format=...`**
  * **Response**: Direct raw binary audio stream (`audio/mpeg` or `audio/wav`) with `Cache-Control: max-age=86400`
* **`POST /api/v1/voice/transcribe`**
  * **Request**: `VoiceTranscriptionRequest` (`audio_base64: str`, `language?: str`, `audio_format: str = "webm" | "wav" | "mp3" | "m4a"`)
  * **Response**: `VoiceTranscriptionResponse` (`transcript: str`, `detected_language: str`, `confidence: float`, `duration_seconds: float`)
* **`POST /api/v1/voice/lesson/{lesson_id}?language=...`**
  * **Response**: `LessonAudioResponse` (`lesson_id`, `stage_id`, `title`, `language`, `audio_base64`, `duration_seconds`, `is_cached`)
* **`POST /api/v1/voice/assistant/query`**
  * **Request**: `VoiceAssistantQueryRequest` (`user_id: int`, `message?: str`, `audio_base64?: str`, `language: str = "te"`, `generate_speech: bool = True`)
  * **Response**: `VoiceAssistantQueryResponse` (`user_id`, `query_text`, `reply_text`, `language`, `is_fallback`, `grounding_metrics`, `suggested_followups`, `audio_base64?: str`, `audio_format: "mp3"`)

---

## 3. Frontend Screen ↔ Backend Endpoint Integration Map

| Screen / Feature | Endpoint(s) | HTTP Method | Request Payload | Response Model | Consuming Frontend State | Loading / Error / Empty UI State |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **App Startup / Splash** (`splash.tsx`) | `GET /api/v1/users/demo/lakshmi`<br>`GET /api/v1/health` | `GET` | None | `UserResponse`<br>`HealthResponse` | `AppContext.user`, `AppContext.isOnline` | Splash skeleton spinner / Offline retry indicator |
| **Onboarding** (`onboarding.tsx`) | `POST /api/v1/users`<br>`GET /api/v1/users/demo/lakshmi` | `POST`<br>`GET` | `UserCreate` (if new)<br>None (if demo) | `UserResponse` | `AppContext.user` | Button loading spinner, Inline form validation |
| **Home Dashboard** (`(tabs)/index.tsx`) | `GET /api/v1/users/{user_id}/financial-health`<br>`GET /api/v1/users/{user_id}/goals`<br>`GET /api/v1/users/{user_id}/journey` | `GET`<br>`GET`<br>`GET` | None | `FinancialSummaryResponse`<br>`List[GoalResponse]`<br>`JourneyRoadmapResponse` | `financialSummary`, `activeGoal`, `currentStage` | Shimmer cards for hero income/surplus, Empty goal fallback |
| **My Money** (`(tabs)/money.tsx`) | `GET /api/v1/users/{user_id}/financial-health`<br>`GET /api/v1/users/{user_id}/transactions`<br>`GET /api/v1/users/{user_id}/debts` | `GET`<br>`GET`<br>`GET` | `type?: str`, `skip`, `limit` | `FinancialSummaryResponse`<br>`List[TransactionResponse]`<br>`List[DebtResponse]` | `summary`, `transactions`, `totalDebt` | Pull-to-refresh spinner, "No transactions logged yet" empty state |
| **Log Transaction Modal** (`LogTransactionModal.tsx`) | `POST /api/v1/users/{user_id}/transactions` | `POST` | `TransactionCreate` | `TransactionResponse` | Optimistically appends to `transactions` & refreshes `financial-health` | "Saving..." button state, input error alerts |
| **Delete Transaction** (`money.tsx`) | `DELETE /api/v1/users/{user_id}/transactions/{tx_id}` | `DELETE` | None | 204 No Content | Removes from `transactions` | Alert confirmation modal, optimistic UI update |
| **Goals & Dream Pots** (`(tabs)/goals.tsx`) | `GET /api/v1/users/{user_id}/goals`<br>`GET /api/v1/users/{user_id}/financial-health` | `GET`<br>`GET` | None | `List[GoalResponse]`<br>`FinancialSummaryResponse` | `goals`, `surplusAllocation` | Goal cards shimmer, "Create your first dream pot" empty state |
| **Create/Edit Dream Pot** (`CreateDreamPotModal.tsx`) | `POST /api/v1/users/{user_id}/goals`<br>`PATCH /api/v1/users/{user_id}/goals/{goal_id}` | `POST`<br>`PATCH` | `GoalCreate`<br>`GoalUpdate` | `GoalResponse` | Adds/updates `goals` in AppContext | Form validation alerts, calculation preview |
| **Goal Savings Deposit** (`goals.tsx`) | `POST /api/v1/users/{user_id}/goals/{goal_id}/deposit` | `POST` | `GoalDepositRequest` (`amount`) | `GoalResponse` | Updates goal `current_amount` & celebratory banner | Quick deposit spinner, confetti trigger |
| **Delete Goal** (`goals.tsx`) | `DELETE /api/v1/users/{user_id}/goals/{goal_id}` | `DELETE` | None | 204 No Content | Removes goal from state | Delete confirmation dialog |
| **Government Schemes / Benefits** (`(tabs)/benefits.tsx` & `schemes.tsx`) | `GET /api/v1/users/{user_id}/schemes/matched`<br>`GET /api/v1/schemes` | `GET`<br>`GET` | Filters: `category`, `jurisdiction`, `search` | `List[SchemeMatchResponse]`<br>`List[SchemeResponse]` | `matchedSchemes`, `allSchemes` | Scheme cards loading skeleton, "No matching schemes found" fallback |
| **Scheme Details Modal** (`SchemeDetailModal.tsx`) | `GET /api/v1/schemes/{slug}`<br>`POST /api/v1/users/{user_id}/schemes/{id}/bookmark` | `GET`<br>`POST` | `BookmarkRequest` | `SchemeResponse`<br>`BookmarkResponse` | `selectedScheme`, `bookmarkStatus` | Detail shimmer loading, checklist toggles |
| **Scheme Matcher Wizard** (`matcher.tsx` & `EligibilityMatcherModal.tsx`) | `GET /api/v1/users/{user_id}/schemes/matched` (or `PATCH /users/{user_id}` on completion) | `GET`<br>`PATCH` | `UserUpdate` | `List[SchemeMatchResponse]` | `matchedResults` | Step transition loaders, match counter animation |
| **7-Stage Journey** (`(tabs)/journey.tsx`) | `GET /api/v1/users/{user_id}/journey` | `GET` | None | `JourneyRoadmapResponse` | `journeyRoadmap`, `activeStage` | Roadmap skeleton, stage lock indicators |
| **Financial Learning** (`(tabs)/learn.tsx`) | `GET /api/v1/learning/modules`<br>`GET /api/v1/knowledge/concepts`<br>`GET /api/v1/users/{user_id}/learning/progress` | `GET`<br>`GET`<br>`GET` | None | `List[ModuleResponse]`<br>`List[FinancialConceptResponse]`<br>`UserLearningSummaryResponse` | `modules`, `concepts`, `userProgress` | Accordion loading state, progress bar |
| **Complete Lesson** (`learn.tsx`) | `POST /api/v1/users/{user_id}/learning/lessons/{id}/complete` | `POST` | `LessonCompleteRequest` (`quiz_score`) | `UserLessonProgressResponse` | Updates completed lesson checklist | Quiz completion badge |
| **Ask Sakhi AI Chat** (`AskSakhiModal.tsx`) | `POST /api/v1/ai/chat`<br>`GET /api/v1/ai/grounding/{user_id}` | `POST`<br>`GET` | `AIChatRequest` (`user_id`, `message`, `language`) | `AIChatResponse`<br>`GroundingMetrics` | `chatMessages`, `liveGroundingMetrics` | Typing dots animation ("Sakhi is thinking..."), network error alert |
| **Voice Query & STT** (`AskSakhiModal.tsx` & Voice buttons) | `POST /api/v1/voice/transcribe`<br>`POST /api/v1/voice/assistant/query` | `POST`<br>`POST` | `VoiceTranscriptionRequest`<br>`VoiceAssistantQueryRequest` | `VoiceTranscriptionResponse`<br>`VoiceAssistantQueryResponse` | `transcribedText`, `audioResponse` | Waveform recording animation, audio playback status |
| **Voice TTS Synthesis / Streaming** (All screens) | `POST /api/v1/voice/synthesize`<br>`GET /api/v1/voice/stream` | `POST`<br>`GET` | `VoiceSynthesisRequest`<br>Query params (`text`, `language`) | `VoiceSynthesisResponse`<br>Binary audio stream | Audio player state (`isPlayingAudio`, duration) | "Playing audio..." speaker animation |
| **Settings & Profile** (`settings.tsx` & `ProfileModal.tsx`) | `GET /api/v1/users/{user_id}`<br>`PATCH /api/v1/users/{user_id}` | `GET`<br>`PATCH` | `UserUpdate` | `UserResponse` | `AppContext.user`, `language`, `state` | "Saved to Device" confirmation badge |

---

## 4. Frontend ↔ Backend Mismatches & Solutions

### Mismatch 1: Hardcoded Lakshmi Profile vs. Dynamic `user_id` Parameter
* **Current Frontend**: All components hardcode "Lakshmi Devi", 28y, Telangana.
* **Backend Contract**: Endpoints require `{user_id}` in path or body.
* **Frontend Adaptation**: `AppContext` manages `user: UserResponse | null`. On startup, if no user exists, it calls `GET /api/v1/users/demo/lakshmi` to bootstrap the official Lakshmi demo profile (`user_id = user.id`).
* **Backend Change Required?**: **NO** — 100% frontend solution.

### Mismatch 2: Client-Side Calculated Surplus vs. Backend Deterministic Financial Engine
* **Current Frontend**: Hardcodes ₹4,200 surplus and uses ad-hoc client calculations `projectedSurplus = baseSurplus +/- amount`.
* **Backend Contract**: `GET /api/v1/users/{user_id}/financial-health` computes deterministic surplus, ratios, emergency fund targets, and health categorization.
* **Frontend Adaptation**: Store `financialSummary: FinancialSummaryResponse | null` in context. When a transaction, goal, or debt is added/updated, invalidate and refetch `/financial-health`.
* **Backend Change Required?**: **NO** — 100% frontend solution.

### Mismatch 3: In-Memory Goals vs. Backend `GoalResponse`
* **Current Frontend**: `AppContext` maintains a static `defaultGoals` list with `timeline: string` and client-generated IDs.
* **Backend Contract**: `GoalResponse` uses `id: int`, `target_amount`, `current_amount`, `target_months`, and computes `remaining_amount`, `progress_percentage`, and `required_monthly_savings`.
* **Frontend Adaptation**: Replace in-memory array with API calls (`GET /users/{user_id}/goals`, `POST /users/{user_id}/goals`, `POST .../deposit`).
* **Backend Change Required?**: **NO** — 100% frontend solution.

### Mismatch 4: Static Schemes vs. Ranked Deterministic Eligibility Matching
* **Current Frontend**: `SCHEMES_DATA` hardcodes 4 schemes with fixed match percentages.
* **Backend Contract**: `GET /api/v1/users/{user_id}/schemes/matched` calculates live eligibility match scores based on user age, income, SHG membership, and location.
* **Frontend Adaptation**: Replace static array with data from `/matched` endpoint. Display `match_score`, `eligibility_reasons`, and `missing_requirements`.
* **Backend Change Required?**: **NO** — 100% frontend solution.

### Mismatch 5: Hardcoded 7-Stage Journey vs. Backend Engine
* **Current Frontend**: Hardcodes Stage 2 Active (42%) in `journey.tsx`.
* **Backend Contract**: `GET /api/v1/users/{user_id}/journey` evaluates actual user metrics across all 7 stages and returns dynamic stage statuses (`completed`, `in_progress`, `locked`).
* **Frontend Adaptation**: Map the backend `stages` list and select localized titles and CTAs based on `primary_language`.
* **Backend Change Required?**: **NO** — 100% frontend solution.

### Mismatch 6: Mock Chat `setTimeout` vs. Grounded Live AI
* **Current Frontend**: `AskSakhiModal` creates a fake timeout reply.
* **Backend Contract**: `POST /api/v1/ai/chat` provides conversational responses grounded in real user data.
* **Frontend Adaptation**: Post message to `/ai/chat` and render live reply, follow-ups, and `grounding_metrics`.
* **Backend Change Required?**: **NO** — 100% frontend solution.

---

## 5. Shared Integration Infrastructure Specifications

### 5.1 Dynamic API Base URL Resolution
* **Android Emulator**: `http://10.0.2.2:8000/api/v1`
* **iOS Simulator & Web**: `http://localhost:8000/api/v1`
* **Physical Device**: `http://<LAN_IP>:8000/api/v1` or `EXPO_PUBLIC_API_URL`
* **Implementation Plan**: Create `frontend/constants/api.ts` with auto-detection via `Platform.OS` and fallback to `EXPO_PUBLIC_API_URL`.

### 5.2 HTTP Client (`apiClient.ts`)
* Configured with `fetch` wrapper.
* Automatic JSON parsing & standardized error extraction (`{ detail: string | array }`).
* Request timeout (10s standard, 30s for AI/voice synthesis).
* Request logging in development mode.

### 5.3 Global User & Data Context (`AppContext.tsx`)
* Centralized state:
  * `currentUser: UserResponse | null`
  * `financialSummary: FinancialSummaryResponse | null`
  * `language: 'te' | 'hi' | 'en'`
  * `isOnline: boolean`
  * Action methods: `refreshFinancials()`, `logTransaction()`, `saveGoal()`, `depositGoal()`, `updatePreferences()`.

---

## 6. Special AI + Voice Architecture Verification

```
                                  ┌───────────────────────────────┐
                                  │   FastAPI Backend (Port 8000) │
                                  │                               │
┌─────────────────────────┐       │  ┌─────────────────────────┐  │       ┌───────────────────────┐
│ React Native Mobile App │───────┼─▶│ /api/v1/ai/chat         │──┼──────▶│ Google Gemini Live AI │
│                         │       │  │ (Grounding Context)     │◀─┼───────│ (Flash Lite Model)    │
│ • UI Components         │       │  └─────────────────────────┘  │       └───────────────────────┘
│ • Expo Audio Recording  │       │                               │
│ • Audio Player (expo-av)│───────┼─▶┌─────────────────────────┐  │       ┌───────────────────────┐
│                         │       │  │ /api/v1/voice/transcribe│──┼──────▶│ Gemini STT Model      │
│ • Zero API Keys on App  │◀──────┼──│ (Base64 -> Text)        │◀─┼───────│ (3.5-transcribe)      │
└─────────────────────────┘       │  └─────────────────────────┘  │       └───────────────────────┘
                                  │                               │
                                  │  ┌─────────────────────────┐  │       ┌───────────────────────┐
                                  │  │ /api/v1/voice/synthesize│──┼──────▶│ gTTS / Indic TTS      │
                                  │  │ (Text -> MP3 Base64)    │◀─┼───────│ (Local Audio Cache)   │
                                  │  └─────────────────────────┘  │       └───────────────────────┘
                                  └───────────────────────────────┘
```

* **Security Confirmation**: The React Native application stores **ZERO** AI keys.
* **Audio Handling**: Microphone audio is encoded to Base64 and sent to `/voice/transcribe`. Synthesized audio Base64 is decoded or streamed via `expo-av` or React Native sound buffers.

---

## 7. Deterministic Financial Logic (Backend Authority)

The frontend will display backend results rather than independently calculating:

1. **Monthly Disposable Surplus**: `monthly_surplus = max(0.0, monthly_income - monthly_expenses)`
2. **Savings Ratio**: `savings_ratio = (monthly_surplus / monthly_income) * 100`
3. **Emergency Fund Target (Suraksha Kavach)**: `emergency_target = 3 * monthly_expenses`
4. **Emergency Fund Progress %**: `min(100.0, (total_savings / emergency_target) * 100)`
5. **Debt Monthly Interest Drain**: `sum(current_balance * monthly_interest_rate / 100)`
6. **Debt Refinancing Arbitrage**: Comparison between moneylender APR (e.g. 36%) and SHG APR (12%).
7. **Goal Monthly Requirement**: `required_monthly_savings = (target_amount - current_amount) / target_months`.
8. **7-Stage Milestone Evaluation**: Computed dynamically in `JourneyEngine`.
9. **Scheme Eligibility Match Ranking**: Computed dynamically in `SchemeService`.

---

## 8. Controlled Integration Phase Plan (I1–I6)

### Phase I1 — API Infrastructure & Shared Client
* **Objective**: Build foundational network layer and user session management.
* **Files**: `frontend/constants/api.ts`, `frontend/services/apiClient.ts`, `frontend/services/userService.ts`, `frontend/context/AppContext.tsx`.
* **Endpoints**: `GET /health`, `GET /users/demo/lakshmi`, `GET /users/{user_id}`, `PATCH /users/{user_id}`.
* **Verification**: Verify successful bootstrapping of Lakshmi profile and connectivity from Android/iOS/Web.

### Phase I2 — User Onboarding & Home Dashboard
* **Objective**: Connect onboarding flow and live home dashboard financial summaries.
* **Screens & Modals**: `app/onboarding.tsx`, `app/(tabs)/index.tsx`, `components/ProfileModal.tsx`, `components/SakhiHeader.tsx`, `app/settings.tsx`.
* **Endpoints**: `POST /users`, `GET /users/{user_id}/financial-health`, `GET /users/{user_id}/goals`, `GET /users/{user_id}/journey`.
* **Verification**: Confirm dashboard shows real income (₹18,500), surplus (₹4,200), and live stage/goal previews.

### Phase I3 — Money Cashflow, Goals & Debt Management
* **Objective**: Connect transaction ledger, savings goal creation/deposits, and debt tracking.
* **Screens & Modals**: `app/(tabs)/money.tsx`, `components/LogTransactionModal.tsx`, `app/(tabs)/goals.tsx`, `components/CreateDreamPotModal.tsx`.
* **Endpoints**: `GET/POST/DELETE /users/{user_id}/transactions`, `GET/POST/PATCH/DELETE /users/{user_id}/goals`, `POST /goals/{id}/deposit`, `GET /users/{user_id}/debts`, `GET /users/{user_id}/debts-analysis/snowball`.
* **Verification**: Add income/expense, verify ledger updates and surplus recalculates; add savings to dream pot, verify progress bar updates.

### Phase I4 — Government Schemes & Learning Modules
* **Objective**: Connect dynamic eligibility matching, scheme catalog, 7-stage roadmap, and multilingual micro-lessons.
* **Screens & Modals**: `app/(tabs)/benefits.tsx`, `app/(tabs)/schemes.tsx`, `components/SchemeDetailModal.tsx`, `components/EligibilityMatcherModal.tsx`, `app/matcher.tsx`, `app/(tabs)/journey.tsx`, `app/(tabs)/learn.tsx`.
* **Endpoints**: `GET /users/{user_id}/schemes/matched`, `GET /schemes`, `POST /schemes/{id}/bookmark`, `GET /users/{user_id}/journey`, `GET /learning/modules`, `GET /knowledge/concepts`.
* **Verification**: Verify matched schemes show ranked match percentages and reasons; test bookmarking and stage progression.

### Phase I5 — Ask Sakhi AI Companion & Voice Integration
* **Objective**: Connect live conversational AI companion and Indic speech synthesis/transcription.
* **Screens & Modals**: `components/AskSakhiModal.tsx`, all audio playback buttons across tabs.
* **Endpoints**: `POST /ai/chat`, `GET /ai/grounding/{user_id}`, `POST /voice/synthesize`, `GET /voice/stream`, `POST /voice/transcribe`, `POST /voice/assistant/query`.
* **Verification**: Ask financial questions in English/Telugu/Hindi, verify grounded response with metrics; test audio synthesis playback.

### Phase I6 — End-to-End Testing & Verification
* **Objective**: Full end-to-end integration test of entire user journey.
* **Verification**: Run unit/integration tests, test offline behavior, check error states, verify no backend modifications.

---

## 9. Phase I1 Implementation & Verification Report

### 9.1 Files Created / Updated
1. `frontend/constants/api.ts`: Created with platform-aware API base URL resolution (`10.0.2.2:8000` on Android emulator, `localhost:8000` on iOS/web, `EXPO_PUBLIC_API_URL` override for physical devices).
2. `frontend/types/api.ts`: Created TypeScript contracts for `UserBase`, `UserCreate`, `UserUpdate`, `UserResponse`, `HealthResponse`, `ReadinessResponse`, and `ApiErrorDetail`.
3. `frontend/services/apiClient.ts`: Created generic HTTP client with `get`, `post`, `patch`, `delete`, JSON serialization, 10s default timeout (configurable for AI/voice), standardized error parsing, and dev logging.
4. `frontend/services/userService.ts`: Created typed service for `checkHealth()`, `getDemoLakshmi()`, `getUser(id)`, `updateUser(id, data)`, and `createUser(data)`.
5. `frontend/context/AppContext.tsx`: Updated with `currentUser`, `userId`, `isOnline`, `isLoading`, `error`, and `bootstrapUser()` / `refreshUser()` / `updateUserPreferences()` actions.

### 9.2 Verification Results
- **TypeScript Check**: `npx tsc --noEmit` passed with exit code `0`.
- **Live Health Connectivity**: `GET http://localhost:8000/api/v1/health` returned HTTP 200 `{ status: "ok", app: "Sakhi", version: "1.0.0" }`.
- **Live Lakshmi Bootstrap**: `GET http://localhost:8000/api/v1/users/demo/lakshmi` returned HTTP 200 (`id: 1`, `name: "Lakshmi"`, `is_shg_member: true`, `state: "Telangana"`).
- **Expo Web Export**: `npx expo export --platform web` bundled all 22 static routes successfully with zero errors.
- **Backend Protection Check**: `git diff backend/` confirmed zero changes. Backend remains 100% read-only and untouched.

---

## 10. Phase I2 Implementation & Verification Report

### 10.1 Files Created / Updated
1. `frontend/types/finance.ts`: Created `FinancialSummaryResponse` and `CategoryBreakdown` contracts.
2. `frontend/types/goal.ts`: Created `GoalBase`, `GoalCreate`, `GoalUpdate`, `GoalDepositRequest`, and `GoalResponse` contracts.
3. `frontend/types/journey.ts`: Created `JourneyRoadmapResponse`, `JourneyStageResponse`, and `LocalizedText` contracts.
4. `frontend/services/financeService.ts`: Created `getFinancialHealth(userId)` calling `GET /api/v1/users/{user_id}/financial-health`.
5. `frontend/services/goalService.ts`: Created goals service for CRUD, progress tracking, and deposits (`POST .../deposit`).
6. `frontend/services/journeyService.ts`: Created `getJourney(userId)` calling `GET /api/v1/users/{user_id}/journey`.
7. `frontend/components/SakhiHeader.tsx`: Dynamic user name and state badge from `currentUser`.
8. `frontend/components/ProfileModal.tsx`: Dynamic member dossier bound to live `currentUser`.
9. `frontend/app/onboarding.tsx`: Dynamic user registration and demo Lakshmi exploration.
10. `frontend/app/settings.tsx`: Live user preference editing with `updateUserPreferences()` (`PATCH /users/{user_id}`).
11. `frontend/app/(tabs)/index.tsx`: Home dashboard bound to live financial health, goals, journey, and pull-to-refresh.

### 10.2 Verification Results
- **TypeScript Check**: `npx tsc --noEmit` passed with exit code `0`.
- **Expo Web Export**: `npx expo export --platform web` bundled all 22 static routes with zero errors.
- **Backend Protection Check**: `git diff backend/` confirmed 0 modifications.

---

## 11. Phase I3 Implementation & Verification Report

### 11.1 Files Created / Updated
1. `frontend/types/transaction.ts`: TypeScript contracts for `TransactionBase`, `TransactionCreate`, `TransactionResponse`.
2. `frontend/types/debt.ts`: TypeScript contracts for `DebtBase`, `DebtCreate`, `DebtUpdate`, `DebtResponse`, `DebtSnowballItem`, `DebtSnowballAnalysisResponse`.
3. `frontend/services/transactionService.ts`: Service for `getTransactions`, `createTransaction`, `deleteTransaction`.
4. `frontend/services/debtService.ts`: Service for `getDebts`, `getDebt`, `createDebt`, `updateDebt`, `deleteDebt`, `getDebtSnowballAnalysis`.
5. `frontend/context/AppContext.tsx`: Added reactive state and action mutations for transactions, goals, debts, and snowball analysis.
6. `frontend/app/(tabs)/money.tsx`: 3 metric cards (income, expenses, total savings), debt interest drain, SHG refinance savings arbitrage, emergency fund benchmark progress, filtered transaction ledger with live deletion.
7. `frontend/components/LogTransactionModal.tsx`: Real-time transaction logging with live projected household surplus calculation and loading states.
8. `frontend/app/(tabs)/goals.tsx`: Real goal cards feed, surplus allocation margin card, quick deposit modal (`+ Add Money`), goal deletion.
9. `frontend/components/CreateDreamPotModal.tsx`: Goal creation and updates with required monthly savings feasibility preview.

### 11.2 Verification Results
- **TypeScript Check**: `npx tsc --noEmit` passed with exit code `0`.
- **Expo Web Export**: `npx expo export --platform web` bundled all 22 static routes with zero errors.
- **Backend Protection Check**: `git diff backend/` confirmed 0 modifications.

---

## 12. Phase I4 Implementation & Verification Report

### 12.1 Files Created / Updated
1. `frontend/types/scheme.ts`: Created contracts for `SchemeBase`, `SchemeResponse`, `SchemeMatchResponse`, `BookmarkRequest`, `BookmarkResponse`.
2. `frontend/types/learning.ts`: Created contracts for `QuizQuestion`, `LessonResponse`, `ModuleResponse`, `LessonCompleteRequest`, `UserLessonProgressResponse`, `UserLearningSummaryResponse`.
3. `frontend/types/knowledge.ts`: Created contracts for `LocalizedText`, `FinancialConceptResponse`, `GoldenRuleResponse`.
4. `frontend/services/schemeService.ts`: Created service for `getSchemes`, `getScheme`, `getMatchedSchemes`, `bookmarkScheme`, `getBookmarkedSchemes`.
5. `frontend/services/learningService.ts`: Created service for `getModules`, `getModule`, `getLesson`, `completeLesson`, `getUserProgress`.
6. `frontend/services/knowledgeService.ts`: Created service for `getConcepts`, `getConcept`, `getGoldenRules`.
7. `frontend/utils/localization.ts`: Created `getLocalizedText` utility helper resolving multilingual `{ en, te, hi }` objects safely falling back to English.
8. `frontend/context/AppContext.tsx`: Extended with `matchedSchemes`, `journeyRoadmap`, `learningProgress`, `language`, `setLanguage`, and `completeLesson()` / `bookmarkScheme()` actions.
9. `frontend/app/(tabs)/benefits.tsx` & `frontend/app/(tabs)/schemes.tsx`: Connected to live matched schemes, category filtering, search, live match scores, and detail modals.
10. `frontend/components/SchemeDetailModal.tsx`: Connected to live scheme metadata, target beneficiaries, interactive required document checklist, and bookmarking/tracking.
11. `frontend/components/EligibilityMatcherModal.tsx` & `frontend/app/matcher.tsx`: Synchronized with live user profile preferences and matched scheme evaluation.
12. `frontend/app/(tabs)/journey.tsx`: Connected to live 7-Stage Financial Freedom Journey roadmap, active milestone target metric card, and completed/active/locked milestones.
13. `frontend/app/(tabs)/learn.tsx`: Connected to live educational modules, micro-lessons with takeaways, comprehension quiz validation, lesson completion recording, 5 Golden Rules of Sakhi, and plain-language financial concepts.

### 12.2 Verification Results
- **TypeScript Check**: `npx tsc --noEmit` passed with exit code `0`.
- **Expo Web Export**: `npx expo export --platform web` bundled all 22 static routes with zero errors.
- **Backend Protection Check**: `git diff backend/` confirmed 0 modifications.
- **Live Endpoint Verification**: All 12 I4 endpoints verified against running FastAPI backend with HTTP 200 OK.
---

## 13. Phase I5 Implementation & Verification Report

### 13.1 Files Created / Updated
1. `frontend/types/ai.ts`: TypeScript contracts for `AIChatRequest`, `GroundingMetrics`, `AIChatResponse`, `ExplainConceptRequest`, `ExplainConceptResponse`.
2. `frontend/types/voice.ts`: TypeScript contracts for `VoiceLanguage`, `SupportedLanguagesResponse`, `VoiceSynthesisRequest`, `VoiceSynthesisResponse`, `VoiceTranscriptionRequest`, `VoiceTranscriptionResponse`, `VoiceAssistantQueryRequest`, `VoiceAssistantQueryResponse`, `LessonAudioResponse`.
3. `frontend/services/aiService.ts`: AI service client for chat (`POST /ai/chat`), grounding metrics (`GET /ai/grounding/{user_id}`), and concept explanation (`POST /ai/explain`).
4. `frontend/services/voiceService.ts`: Voice service client for supported languages (`GET /voice/languages`), speech synthesis (`POST /voice/synthesize`), streaming audio URL (`GET /voice/stream`), speech transcription (`POST /voice/transcribe`), unified voice assistant (`POST /voice/assistant/query`), and micro-lesson audio (`POST /voice/lesson/{lesson_id}`).
5. `frontend/services/audioPlayer.ts`: Lightweight cross-platform audio player controller supporting Base64 data URIs and audio stream URLs with track cancellation and subscription listener.
6. `frontend/components/AskSakhiModal.tsx`: Real-time AI chat companion connected to `aiService.chat()`, live Member Data financial strip (income, expenses, disposable surplus, debt, emergency shield progress, active journey stage), dynamic backend `suggested_followups` chips, Web `MediaRecorder` voice STT capture via `voiceService.transcribe()`, and per-message TTS audio playback via `voiceService.synthesizeSpeech()`.
7. `frontend/app/(tabs)/learn.tsx`: Bound micro-lesson audio play buttons to `voiceService.getLessonAudio(lessonNum, language)` and `audioPlayer`.
8. `frontend/components/SchemeDetailModal.tsx`: Bound scheme audio narration button to `voiceService.synthesizeSpeech()` and `audioPlayer`.
9. `frontend/components/EligibilityMatcherModal.tsx` & `frontend/app/matcher.tsx`: Bound wizard step guidance voiceover to `voiceService.synthesizeSpeech()`.
10. `frontend/app/(tabs)/schemes.tsx` & `frontend/app/(tabs)/benefits.tsx`: Bound scheme card listen buttons to `voiceService.synthesizeSpeech()`.
11. `frontend/app/(tabs)/journey.tsx`: Bound active milestone listen button to `voiceService.synthesizeSpeech()`.
12. `frontend/app/tour.tsx`: Bound step audio preview button to `voiceService.synthesizeSpeech()`.

### 13.2 Verification Results
- **TypeScript Check**: `npx tsc --noEmit` passed with exit code `0` (0 errors).
- **Expo Web Export**: `npx expo export --platform web` bundled all 22 static routes with zero errors.
- **Backend Protection Check**: `git diff backend/` confirmed 0 modifications (Backend is 100% READ-ONLY).
- **Frontend Security Audit**: Confirmed 0 API keys (`GEMINI_API_KEY`, `BHASHINI_API_KEY`, `AIza...`) in `frontend/`. All AI/Voice interactions route exclusively via FastAPI backend.
- **Live Endpoint Verification**: All 12 AI and Voice endpoints verified against live running FastAPI backend (`http://localhost:8000`) with HTTP 200 OK across Telugu (`te`), Hindi (`hi`), and English (`en`).

