import apiClient from './apiClient';
import { GoalResponse, GoalCreate, GoalUpdate, GoalDepositRequest } from '@/types/goal';

/**
 * Sakhi Goal Service.
 * Provides access to savings goals, progress tracking, and contributions.
 */
export const goalService = {
  /**
   * Retrieve all goals for a user.
   */
  getGoals: async (userId: number): Promise<GoalResponse[]> => {
    return apiClient.get<GoalResponse[]>(`/users/${userId}/goals`);
  },

  /**
   * Retrieve a single goal with deterministic progress calculations.
   */
  getGoal: async (userId: number, goalId: number): Promise<GoalResponse> => {
    return apiClient.get<GoalResponse>(`/users/${userId}/goals/${goalId}`);
  },

  /**
   * Create a new savings goal.
   */
  createGoal: async (userId: number, goalData: GoalCreate): Promise<GoalResponse> => {
    return apiClient.post<GoalResponse>(`/users/${userId}/goals`, goalData);
  },

  /**
   * Add a deposit towards a savings goal.
   */
  depositToGoal: async (userId: number, goalId: number, amount: number): Promise<GoalResponse> => {
    return apiClient.post<GoalResponse>(`/users/${userId}/goals/${goalId}/deposit`, { amount });
  },

  /**
   * Update an existing savings goal.
   */
  updateGoal: async (userId: number, goalId: number, updateData: GoalUpdate): Promise<GoalResponse> => {
    return apiClient.patch<GoalResponse>(`/users/${userId}/goals/${goalId}`, updateData);
  },

  /**
   * Delete a savings goal by ID.
   */
  deleteGoal: async (userId: number, goalId: number): Promise<void> => {
    return apiClient.delete<void>(`/users/${userId}/goals/${goalId}`);
  },
};

export default goalService;
