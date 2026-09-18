/**
 * Sakhi Shared API Types & Contracts.
 *
 * Strictly synchronized with backend Pydantic models in backend/app/schemas/.
 */

// -----------------------------------------------------------------------------
// Health & Diagnostic Models
// -----------------------------------------------------------------------------
export interface HealthResponse {
  status: string;
  app: string;
  version: string;
  environment: string;
  timestamp: string;
}

export interface ReadinessResponse {
  status: string;
  database: string;
  app: string;
  version: string;
  timestamp: string;
}

export interface MetricsResponse {
  app: string;
  version: string;
  environment: string;
  uptime_seconds: number;
  database_status: string;
  ai_provider: string;
  voice_tts_provider: string;
  timestamp: string;
}

// -----------------------------------------------------------------------------
// User Profile Models
// -----------------------------------------------------------------------------
export interface UserBase {
  name: string;
  phone_number?: string | null;
  age: number;
  gender: string;
  state: string;
  district?: string | null;
  locality_type: string;
  primary_language: string;
  is_shg_member: boolean;
  shg_name?: string | null;
  occupation?: string | null;
  monthly_income: number;
  monthly_expenses: number;
  initial_savings: number;
  initial_debt: number;
}

export interface UserCreate {
  name: string;
  phone_number?: string | null;
  age?: number;
  gender?: string;
  state?: string;
  district?: string | null;
  locality_type?: string;
  primary_language?: string;
  is_shg_member?: boolean;
  shg_name?: string | null;
  occupation?: string | null;
  monthly_income?: number;
  monthly_expenses?: number;
  initial_savings?: number;
  initial_debt?: number;
}

export interface UserUpdate {
  name?: string;
  phone_number?: string | null;
  age?: number;
  gender?: string;
  state?: string;
  district?: string | null;
  locality_type?: string;
  primary_language?: string;
  is_shg_member?: boolean;
  shg_name?: string | null;
  occupation?: string | null;
  monthly_income?: number;
  monthly_expenses?: number;
  initial_savings?: number;
  initial_debt?: number;
}

export interface UserResponse extends UserBase {
  id: number;
  created_at: string;
  updated_at: string;
}

// -----------------------------------------------------------------------------
// Standard API Error Model
// -----------------------------------------------------------------------------
export interface ApiErrorDetail {
  message: string;
  status: number;
  raw?: any;
}
