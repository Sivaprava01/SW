/**
 * Financial Learning API Service.
 * Consumes FastAPI backend /api/v1/learning and /api/v1/users/{user_id}/learning.
 */

import { apiClient } from './apiClient';
import {
  ModuleResponse,
  LessonResponse,
  LessonCompleteRequest,
  UserLessonProgressResponse,
  UserLearningSummaryResponse,
} from '../types/learning';

export const learningService = {
  /**
   * List all learning modules with embedded lessons.
   */
  async getModules(): Promise<ModuleResponse[]> {
    return apiClient.get<ModuleResponse[]>('/learning/modules');
  },

  /**
   * Get a single module by module ID.
   */
  async getModule(moduleId: string): Promise<ModuleResponse> {
    return apiClient.get<ModuleResponse>(`/learning/modules/${moduleId}`);
  },

  /**
   * Get a single micro-lesson with audio transcript and quiz.
   */
  async getLesson(lessonId: string): Promise<LessonResponse> {
    return apiClient.get<LessonResponse>(`/learning/lessons/${lessonId}`);
  },

  /**
   * Mark a lesson complete for the user with optional quiz score.
   */
  async completeLesson(
    userId: number,
    lessonId: string,
    data: LessonCompleteRequest = {}
  ): Promise<UserLessonProgressResponse> {
    return apiClient.post<UserLessonProgressResponse>(
      `/users/${userId}/learning/lessons/${lessonId}/complete`,
      data
    );
  },

  /**
   * Get user learning summary and overall progress percentage.
   */
  async getUserProgress(userId: number): Promise<UserLearningSummaryResponse> {
    return apiClient.get<UserLearningSummaryResponse>(
      `/users/${userId}/learning/progress`
    );
  },
};
