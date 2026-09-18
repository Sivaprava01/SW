/**
 * Sakhi AI Companion & Grounding Service.
 * Connects frontend to /api/v1/ai endpoints.
 */

import { apiClient } from './apiClient';
import { API_CONFIG } from '@/constants/api';
import {
  AIChatRequest,
  AIChatResponse,
  GroundingMetrics,
  ExplainConceptRequest,
  ExplainConceptResponse,
} from '@/types/ai';

export const aiService = {
  /**
   * Conversational chat with Sakhi AI, grounded in real-time user financial context.
   * POST /api/v1/ai/chat
   */
  async chat(payload: AIChatRequest): Promise<AIChatResponse> {
    return apiClient.post<AIChatResponse>('/ai/chat', payload, {
      timeoutMs: API_CONFIG.AI_VOICE_TIMEOUT_MS,
    });
  },

  /**
   * Retrieve deterministic financial grounding metrics snapshot for a user.
   * GET /api/v1/ai/grounding/{user_id}
   */
  async getGroundingMetrics(userId: number): Promise<GroundingMetrics> {
    return apiClient.get<GroundingMetrics>(`/ai/grounding/${userId}`, {
      timeoutMs: API_CONFIG.DEFAULT_TIMEOUT_MS,
    });
  },

  /**
   * Universal concept explainer for plain-language financial guidance.
   * POST /api/v1/ai/explain
   */
  async explainConcept(payload: ExplainConceptRequest): Promise<ExplainConceptResponse> {
    return apiClient.post<ExplainConceptResponse>('/ai/explain', payload, {
      timeoutMs: API_CONFIG.AI_VOICE_TIMEOUT_MS,
    });
  },
};

export default aiService;
