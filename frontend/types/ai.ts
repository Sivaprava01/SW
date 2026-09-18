/**
 * Sakhi AI Companion & Grounding Types.
 * Matches backend Pydantic v2 schemas from app.schemas.ai.
 */

export interface AIChatRequest {
  user_id: number;
  message: string;
  language?: string;
}

export interface GroundingMetrics {
  user_name: string;
  monthly_income: number;
  monthly_expenses: number;
  monthly_surplus: number;
  savings_ratio_percentage: number;
  current_savings: number;
  emergency_fund_target: number;
  emergency_fund_progress_percentage: number;
  total_debt: number;
  monthly_interest_drain: number;
  active_goals_count: number;
  current_stage: number;
  current_stage_title: string;
  matched_schemes_count: number;
  is_shg_member: boolean;
}

export interface AIChatResponse {
  reply: string;
  language: string;
  is_fallback: boolean;
  grounding_metrics?: GroundingMetrics | null;
  suggested_followups: string[];
}

export interface ExplainConceptRequest {
  concept_slug: string;
  language?: string;
}

export interface ExplainConceptResponse {
  concept_slug: string;
  title: string;
  explanation: string;
  practical_example: string;
  golden_rule?: string | null;
  language: string;
}
