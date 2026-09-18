/**
 * Government Schemes API Service.
 * Consumes FastAPI backend /api/v1/schemes and /api/v1/users/{user_id}/schemes.
 */

import { apiClient } from './apiClient';
import {
  SchemeResponse,
  SchemeMatchResponse,
  BookmarkRequest,
  BookmarkResponse,
} from '../types/scheme';

export interface SchemeFilters {
  category?: string;
  jurisdiction?: string;
  requires_shg?: boolean;
  search?: string;
}

export const schemeService = {
  /**
   * List all verified government schemes with optional filters.
   */
  async getSchemes(filters?: SchemeFilters): Promise<SchemeResponse[]> {
    const params = new URLSearchParams();
    if (filters?.category && filters.category !== 'all') {
      params.append('category', filters.category);
    }
    if (filters?.jurisdiction) {
      params.append('jurisdiction', filters.jurisdiction);
    }
    if (filters?.requires_shg !== undefined) {
      params.append('requires_shg', String(filters.requires_shg));
    }
    if (filters?.search) {
      params.append('search', filters.search);
    }

    const query = params.toString();
    const endpoint = `/schemes${query ? `?${query}` : ''}`;
    return apiClient.get<SchemeResponse[]>(endpoint);
  },

  /**
   * Get full scheme details by ID or slug.
   */
  async getScheme(idOrSlug: string | number): Promise<SchemeResponse> {
    return apiClient.get<SchemeResponse>(`/schemes/${idOrSlug}`);
  },

  /**
   * Get deterministically matched schemes for the user.
   */
  async getMatchedSchemes(userId: number): Promise<SchemeMatchResponse[]> {
    return apiClient.get<SchemeMatchResponse[]>(`/users/${userId}/schemes/matched`);
  },

  /**
   * Bookmark a scheme or update user application status.
   */
  async bookmarkScheme(
    userId: number,
    schemeId: number,
    data: BookmarkRequest
  ): Promise<BookmarkResponse> {
    return apiClient.post<BookmarkResponse>(
      `/users/${userId}/schemes/${schemeId}/bookmark`,
      data
    );
  },

  /**
   * Get all bookmarked schemes for the user.
   */
  async getBookmarkedSchemes(userId: number): Promise<BookmarkResponse[]> {
    return apiClient.get<BookmarkResponse[]>(`/users/${userId}/schemes/bookmarked`);
  },
};
