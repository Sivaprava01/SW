/**
 * Financial Knowledge & Golden Rules API Service.
 * Consumes FastAPI backend /api/v1/knowledge.
 */

import { apiClient } from './apiClient';
import {
  FinancialConceptResponse,
  GoldenRuleResponse,
} from '../types/knowledge';

export const knowledgeService = {
  /**
   * List financial literacy concepts with optional category filter.
   */
  async getConcepts(category?: string): Promise<FinancialConceptResponse[]> {
    const query = category ? `?category=${encodeURIComponent(category)}` : '';
    return apiClient.get<FinancialConceptResponse[]>(`/knowledge/concepts${query}`);
  },

  /**
   * Get a single concept by slug or ID.
   */
  async getConcept(conceptIdOrSlug: string): Promise<FinancialConceptResponse> {
    return apiClient.get<FinancialConceptResponse>(`/knowledge/concepts/${conceptIdOrSlug}`);
  },

  /**
   * Get the 5 Golden Rules of Sakhi.
   */
  async getGoldenRules(): Promise<GoldenRuleResponse[]> {
    return apiClient.get<GoldenRuleResponse[]>('/knowledge/golden-rules');
  },
};
