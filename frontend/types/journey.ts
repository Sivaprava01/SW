/**
 * Sakhi 7-Stage Financial Journey Schemas.
 * Strictly synchronized with backend/app/schemas/journey.py and knowledge.py.
 */

export interface LocalizedText {
  en: string;
  te: string;
  hi: string;
}

export interface JourneyStageResponse {
  stage_number: number;
  stage_key: string;
  title: LocalizedText;
  subtitle: LocalizedText;
  status: 'completed' | 'in_progress' | 'locked';
  progress_percentage: number;
  target_metric_label: string;
  target_metric_value: string;
  unlocked_badge?: string | null;
  action_cta: LocalizedText;
}

export interface JourneyRoadmapResponse {
  user_id: number;
  current_active_stage: number;
  completed_stages_count: number;
  total_stages: number;
  overall_journey_progress_percentage: number;
  next_milestone_action: LocalizedText;
  stages: JourneyStageResponse[];
}
