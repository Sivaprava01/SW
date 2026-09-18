import apiClient from './apiClient';
import { FinancialSummaryResponse } from '@/types/finance';

/**
 * Sakhi Financial Health Service.
 * Provides deterministic financial summaries, surplus calculations, and expense breakdowns.
 */
export const financeService = {
  /**
   * Retrieve deterministic financial health overview for a user.
   */
  getFinancialHealth: async (userId: number): Promise<FinancialSummaryResponse> => {
    return apiClient.get<FinancialSummaryResponse>(`/users/${userId}/financial-health`);
  },
};

export default financeService;
