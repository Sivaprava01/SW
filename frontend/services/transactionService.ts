import apiClient from './apiClient';
import { TransactionResponse, TransactionCreate } from '@/types/transaction';

/**
 * Sakhi Transaction Service.
 * Provides access to logging, retrieving, and deleting income/expense transactions.
 */
export const transactionService = {
  /**
   * List transactions for a user with optional type filtering and pagination.
   */
  getTransactions: async (
    userId: number,
    type?: 'income' | 'expense',
    skip: number = 0,
    limit: number = 50
  ): Promise<TransactionResponse[]> => {
    const params = new URLSearchParams();
    if (type) params.append('type', type);
    if (skip > 0) params.append('skip', skip.toString());
    if (limit !== 50) params.append('limit', limit.toString());
    const query = params.toString() ? `?${params.toString()}` : '';
    return apiClient.get<TransactionResponse[]>(`/users/${userId}/transactions${query}`);
  },

  /**
   * Log an income or expense transaction.
   */
  createTransaction: async (userId: number, data: TransactionCreate): Promise<TransactionResponse> => {
    return apiClient.post<TransactionResponse>(`/users/${userId}/transactions`, data);
  },

  /**
   * Delete a transaction record by ID.
   */
  deleteTransaction: async (userId: number, transactionId: number): Promise<void> => {
    return apiClient.delete<void>(`/users/${userId}/transactions/${transactionId}`);
  },
};

export default transactionService;
