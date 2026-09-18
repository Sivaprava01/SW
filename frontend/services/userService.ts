import apiClient from './apiClient';
import {
  UserResponse,
  UserCreate,
  UserUpdate,
  HealthResponse,
} from '@/types/api';

/**
 * Sakhi User & Health Service.
 *
 * Provides typed methods for user profile onboarding, demo profile retrieval,
 * updates, and server health diagnostics.
 */
export const userService = {
  /**
   * Check backend liveness.
   */
  checkHealth: async (): Promise<HealthResponse> => {
    return apiClient.get<HealthResponse>('/health');
  },

  /**
   * Retrieve or initialize the standardized reference Lakshmi demo profile.
   */
  getDemoLakshmi: async (): Promise<UserResponse> => {
    return apiClient.get<UserResponse>('/users/demo/lakshmi');
  },

  /**
   * Retrieve a user profile by unique integer ID.
   */
  getUser: async (userId: number): Promise<UserResponse> => {
    return apiClient.get<UserResponse>(`/users/${userId}`);
  },

  /**
   * Update demographic or baseline financial information for a user.
   */
  updateUser: async (userId: number, updateData: UserUpdate): Promise<UserResponse> => {
    return apiClient.patch<UserResponse>(`/users/${userId}`, updateData);
  },

  /**
   * Onboard a new user with baseline profile attributes.
   */
  createUser: async (createData: UserCreate): Promise<UserResponse> => {
    return apiClient.post<UserResponse>('/users', createData);
  },

  /**
   * List registered user profiles with pagination.
   */
  listUsers: async (skip: number = 0, limit: number = 50): Promise<UserResponse[]> => {
    return apiClient.get<UserResponse[]>(`/users?skip=${skip}&limit=${limit}`);
  },
};

export default userService;
