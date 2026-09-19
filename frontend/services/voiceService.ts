/**
 * Sakhi Voice & Indic Speech Service.
 * Connects frontend to /api/v1/voice endpoints.
 */

import { apiClient } from './apiClient';
import { API_CONFIG } from '@/constants/api';
import {
  SupportedLanguagesResponse,
  VoiceSynthesisRequest,
  VoiceSynthesisResponse,
  VoiceTranscriptionRequest,
  VoiceTranscriptionResponse,
  VoiceAssistantQueryRequest,
  VoiceAssistantQueryResponse,
  LessonAudioResponse,
} from '@/types/voice';

export const voiceService = {
  /**
   * Retrieve supported Indic voice models and speaker personas.
   * GET /api/v1/voice/languages
   */
  async getSupportedLanguages(): Promise<SupportedLanguagesResponse> {
    return apiClient.get<SupportedLanguagesResponse>('/voice/languages', {
      timeoutMs: API_CONFIG.DEFAULT_TIMEOUT_MS,
    });
  },

  /**
   * Synthesize Indic text into speech audio bytes (Base64).
   * POST /api/v1/voice/synthesize
   */
  async synthesizeSpeech(payload: VoiceSynthesisRequest): Promise<VoiceSynthesisResponse> {
    const finalPayload = {
      ...payload,
      speed: payload.speed ?? 1.25,
    };
    return apiClient.post<VoiceSynthesisResponse>('/voice/synthesize', finalPayload, {
      timeoutMs: API_CONFIG.AI_VOICE_TIMEOUT_MS,
    });
  },

  /**
   * Constructs the direct streaming audio URL for HTML5 / Native playback.
   * GET /api/v1/voice/stream
   */
  getStreamUrl(
    text: string,
    language: string = 'te',
    speed: number = 1.25,
    format: string = 'mp3'
  ): string {
    const baseUrl = apiClient.getBaseUrl();
    const cleanBase = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
    const params = new URLSearchParams({
      text,
      language,
      speed: String(speed),
      format,
    });
    return `${cleanBase}/voice/stream?${params.toString()}`;
  },

  /**
   * Transcribe recorded audio (Base64) to text using Gemini Audio STT.
   * POST /api/v1/voice/transcribe
   */
  async transcribeSpeech(payload: VoiceTranscriptionRequest): Promise<VoiceTranscriptionResponse> {
    return apiClient.post<VoiceTranscriptionResponse>('/voice/transcribe', payload, {
      timeoutMs: API_CONFIG.AI_VOICE_TIMEOUT_MS,
    });
  },

  /**
   * Interactive voice companion query loop (STT -> AI Grounding -> TTS).
   * POST /api/v1/voice/assistant/query
   */
  async processVoiceQuery(
    payload: VoiceAssistantQueryRequest
  ): Promise<VoiceAssistantQueryResponse> {
    return apiClient.post<VoiceAssistantQueryResponse>('/voice/assistant/query', payload, {
      timeoutMs: API_CONFIG.AI_VOICE_TIMEOUT_MS,
    });
  },

  /**
   * Fetch voiceover narration for a financial learning lesson.
   * POST /api/v1/voice/lesson/{lesson_id}
   */
  async getLessonAudio(lessonId: number, language: string = 'te'): Promise<LessonAudioResponse> {
    return apiClient.post<LessonAudioResponse>(
      `/voice/lesson/${lessonId}`,
      undefined,
      {
        params: { language },
        timeoutMs: API_CONFIG.AI_VOICE_TIMEOUT_MS,
      }
    );
  },
};

export default voiceService;
