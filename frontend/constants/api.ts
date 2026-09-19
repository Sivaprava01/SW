import { Platform, NativeModules } from 'react-native';
import Constants from 'expo-constants';

/**
 * Sakhi API Configuration Constants.
 *
 * Production / Standalone Builds (!__DEV__):
 * - Always targets https://sw-6ihx.onrender.com/api/v1 (or EXPO_PUBLIC_API_URL if valid HTTPS).
 * - Strictly prohibits local dev IPs (10.0.2.2, localhost, 127.0.0.1, http://) in production.
 *
 * Development Builds (__DEV__ === true):
 * - Explicit EXPO_PUBLIC_API_URL override (if specified).
 * - Web Browser: dynamically targets window.location.hostname:8000.
 * - Metro Host IP extraction (NativeModules / Constants).
 * - Android Emulator fallback (10.0.2.2:8000) or iOS Simulator (localhost:8000).
 */

export const PRODUCTION_API_BASE_URL = 'https://sw-6ihx.onrender.com/api/v1';

/**
 * Checks if a given URL is a local development loopback / private IP / cleartext HTTP.
 */
export const isLocalDevelopmentUrl = (url: string): boolean => {
  if (!url) return false;
  const lower = url.toLowerCase().trim();
  return (
    lower.includes('10.0.2.2') ||
    lower.includes('localhost') ||
    lower.includes('127.0.0.1') ||
    lower.startsWith('http://')
  );
};

/**
 * Normalizes an API base URL so it cleanly ends with /api/v1 without double slashes.
 */
export const normalizeApiUrl = (url: string): string => {
  const clean = url.trim().replace(/\/+$/, '');
  return clean.endsWith('/api/v1') ? clean : `${clean}/api/v1`;
};

export const getApiBaseUrl = (): string => {
  const isDev = typeof __DEV__ !== 'undefined' ? __DEV__ : false;

  // 1. Explicit environment variable override takes precedence
  const envUrl = process.env.EXPO_PUBLIC_API_URL?.trim();
  if (envUrl) {
    // If in production (!isDev), ensure envUrl is not an accidental localhost/cleartext URL
    if (!isDev && isLocalDevelopmentUrl(envUrl)) {
      if (typeof console !== 'undefined' && console.warn) {
        console.warn(
          `[API_CONFIG] Insecure/local EXPO_PUBLIC_API_URL ("${envUrl}") detected in production build. Falling back to secure production endpoint: ${PRODUCTION_API_BASE_URL}`
        );
      }
      return PRODUCTION_API_BASE_URL;
    }
    return normalizeApiUrl(envUrl);
  }

  // 2. Extra config from app.json / Constants (e.g. extra.apiUrl)
  const extraApiUrl = (Constants.expoConfig?.extra as any)?.apiUrl as string | undefined;
  if (!isDev && extraApiUrl && !isLocalDevelopmentUrl(extraApiUrl)) {
    return normalizeApiUrl(extraApiUrl);
  }

  // 3. PRODUCTION FALLBACK: If not in local dev (__DEV__ is false), ALWAYS use production backend
  if (!isDev) {
    return PRODUCTION_API_BASE_URL;
  }

  // ========================================================
  // --- LOCAL DEVELOPMENT ONLY (__DEV__ === true) ---
  // ========================================================

  // 4. Web browser in local dev: resolve from window.location.hostname
  if (Platform.OS === 'web' && typeof window !== 'undefined' && window.location?.hostname) {
    const host = window.location.hostname;
    return `http://${host}:8000/api/v1`;
  }

  // 5. Native Dev: Resolve Metro bundle host IP from NativeModules.SourceCode.scriptURL
  try {
    const scriptURL: string | undefined = NativeModules?.SourceCode?.scriptURL;
    if (scriptURL) {
      const match = scriptURL.match(/https?:\/\/([^:/]+)/i) || scriptURL.match(/exp:\/\/([^:/]+)/i);
      if (match && match[1] && match[1] !== 'localhost' && match[1] !== '127.0.0.1') {
        return `http://${match[1]}:8000/api/v1`;
      }
    }
  } catch {
    // NativeModules access fallback
  }

  // 6. Expo Go / Dev Client: inspect hostUri candidates in Constants
  const candidateUris: (string | undefined)[] = [
    Constants.expoConfig?.hostUri,
    (Constants as any).expoGoConfig?.debuggerHost,
    (Constants as any).manifest?.debuggerHost,
    (Constants as any).manifest2?.extra?.expoClient?.hostUri,
    Constants.linkingUri,
    Constants.experienceUrl,
  ];

  for (const uri of candidateUris) {
    if (uri && typeof uri === 'string') {
      const ipMatch = uri.match(/(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})/);
      if (ipMatch && ipMatch[1] && ipMatch[1] !== '127.0.0.1' && ipMatch[1] !== '10.0.2.2') {
        return `http://${ipMatch[1]}:8000/api/v1`;
      }
      const hostPart = uri.split(':')[0]?.replace(/^[a-z]+:\/\//i, '');
      if (hostPart && hostPart !== 'localhost' && hostPart !== '127.0.0.1') {
        return `http://${hostPart}:8000/api/v1`;
      }
    }
  }

  // 7. Android Emulator loopback fallback in local dev
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:8000/api/v1';
  }

  // 8. iOS Simulator / Default in local dev
  return 'http://localhost:8000/api/v1';
};

export const API_CONFIG = {
  get BASE_URL() {
    return getApiBaseUrl();
  },
  DEFAULT_TIMEOUT_MS: 10000,
  AI_VOICE_TIMEOUT_MS: 30000,
};

export default API_CONFIG;
