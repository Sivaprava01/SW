/**
 * Sakhi Voice & Indic Speech Types.
 * Matches backend Pydantic v2 schemas from app.schemas.voice.
 */

import { GroundingMetrics } from './ai';

export interface VoiceLanguage {
  code: string;
  bcp47: string;
  name: string;
  native_name: string;
  speaker_name: string;
  gender: string;
  sample_rate: number;
  description: string;
}

export interface SupportedLanguagesResponse {
  languages: VoiceLanguage[];
  default_language: string;
  total_supported: number;
}

export interface VoiceSynthesisRequest {
  text: string;
  language?: string;
  speed?: number;
  audio_format?: string;
}

export interface VoiceSynthesisResponse {
  audio_base64: string;
  audio_format: string;
  duration_seconds: number;
  sample_rate: number;
  character_count: number;
  language: string;
  voice_name: string;
  is_cached: boolean;
}

export interface VoiceTranscriptionRequest {
  audio_base64: string;
  language?: string | null;
  audio_format?: string;
}

export interface VoiceTranscriptionResponse {
  transcript: string;
  detected_language: string;
  confidence: number;
  duration_seconds: number;
}

export interface VoiceAssistantQueryRequest {
  user_id: number;
  message?: string | null;
  audio_base64?: string | null;
  language?: string;
  generate_speech?: boolean;
}

export interface VoiceAssistantQueryResponse {
  user_id: number;
  query_text: string;
  reply_text: string;
  language: string;
  is_fallback: boolean;
  grounding_metrics?: GroundingMetrics | null;
  suggested_followups: string[];
  audio_base64?: string | null;
  audio_format?: string | null;
}

export interface LessonAudioResponse {
  lesson_id: number;
  stage_id: number;
  title: string;
  language: string;
  audio_base64: string;
  audio_format: string;
  duration_seconds: number;
  is_cached: boolean;
}
