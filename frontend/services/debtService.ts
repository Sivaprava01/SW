import apiClient from './apiClient';
import {
  DebtResponse,
  DebtCreate,
  DebtUpdate,
  DebtSnowballAnalysisResponse,
} from '@/types/debt';

/**
 * Sakhi Debt Service.
 * Provides access to debt liabilities and deterministic snowball refinancing analysis.
 */
export const debtService = {
  /**
   * List all debts for a user.
   */
  getDebts: async (userId: number): Promise<DebtResponse[]> => {
    return apiClient.get<DebtResponse[]>(`/users/${userId}/debts`);
  },

  /**
   * Get a single debt record by ID.
   */
  getDebt: async (userId: number, debtId: number): Promise<DebtResponse> => {
    return apiClient.get<DebtResponse>(`/users/${userId}/debts/${debtId}`);
  },

  /**
   * Record a new debt liability.
   */
  createDebt: async (userId: number, data: DebtCreate): Promise<DebtResponse> => {
    return apiClient.post<DebtResponse>(`/users/${userId}/debts`, data);
  },

  /**
   * Update an existing debt record.
   */
  updateDebt: async (userId: number, debtId: number, data: DebtUpdate): Promise<DebtResponse> => {
    return apiClient.patch<DebtResponse>(`/users/${userId}/debts/${debtId}`, data);
  },

  /**
   * Delete a debt record by ID.
   */
  deleteDebt: async (userId: number, debtId: number): Promise<void> => {
    return apiClient.delete<void>(`/users/${userId}/debts/${debtId}`);
  },

  /**
   * Get deterministic snowball payoff ranking and SHG refinancing opportunity report.
   */
  getDebtSnowballAnalysis: async (userId: number): Promise<DebtSnowballAnalysisResponse> => {
    return apiClient.get<DebtSnowballAnalysisResponse>(`/users/${userId}/debts-analysis/snowball`);
  },
};

export default debtService;
