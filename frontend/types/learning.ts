/**
 * Sakhi Learning Modules & Lessons Schemas.
 * Strictly synchronized with backend/app/schemas/learning.py.
 */

import { LocalizedText } from './knowledge';

export interface QuizQuestion {
  question: LocalizedText;
  options: LocalizedText[];
  correct_option_index: number;
  explanation: LocalizedText;
}

export interface LessonResponse {
  lesson_id: string;
  title: LocalizedText;
  duration_minutes: number;
  audio_narration_script: LocalizedText;
  key_takeaways: LocalizedText[];
  quiz?: QuizQuestion | null;
}

export interface ModuleResponse {
  module_id: string;
  category: string;
  title: LocalizedText;
  description: LocalizedText;
  icon: string;
  total_lessons: number;
  lessons: LessonResponse[];
}

export interface LessonCompleteRequest {
  quiz_score?: number | null;
}

export interface UserLessonProgressResponse {
  id: number;
  user_id: number;
  module_id: string;
  lesson_id: string;
  is_completed: boolean;
  quiz_score?: number | null;
  created_at: string;
  updated_at: string;
}

export interface UserLearningSummaryResponse {
  user_id: number;
  total_available_lessons: number;
  completed_lessons_count: number;
  overall_progress_percentage: number;
  completed_lesson_ids: string[];
}
