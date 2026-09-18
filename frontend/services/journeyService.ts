import apiClient from './apiClient';
import { JourneyRoadmapResponse } from '@/types/journey';

/**
 * Sakhi 7-Stage Financial Journey Service.
 * Evaluates deterministic milestone progression across the 7 stages of financial empowerment.
 */
export const journeyService = {
  /**
   * Retrieve the 7-stage roadmap evaluated against real user data.
   */
  getJourney: async (userId: number): Promise<JourneyRoadmapResponse> => {
    return apiClient.get<JourneyRoadmapResponse>(`/users/${userId}/journey`);
  },
};

export default journeyService;
