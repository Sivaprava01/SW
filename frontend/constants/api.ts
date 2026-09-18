import { Platform } from 'react-native';
import Constants from 'expo-constants';

/**
 * Sakhi API Configuration Constants.
 *
 * Supports automatic local development resolution across platforms:
 * - Web Browser: dynamically targets window.location.hostname:8000
 * - Expo Go (Mobile Device/Emulator): dynamically extracts Metro host IP (e.g. 192.168.x.x)
 * - Android Emulator fallback: 10.0.2.2:8000
 * - Explicit Override: configured via EXPO_PUBLIC_API_URL
 */

const getApiBaseUrl = (): string => {
  // 1. Explicit environment variable override takes top precedence
  if (process.env.EXPO_PUBLIC_API_URL) {
    const envUrl = process.env.EXPO_PUBLIC_API_URL.replace(/\/+$/, '');
    return envUrl.endsWith('/api/v1') ? envUrl : `${envUrl}/api/v1`;
  }

  // 2. Web browser: resolve from window.location.hostname
  if (Platform.OS === 'web' && typeof window !== 'undefined' && window.location?.hostname) {
    const host = window.location.hostname;
    return `http://${host}:8000/api/v1`;
  }

  // 3. Expo Go on Physical Device / Emulator: resolve from hostUri
  const hostUri =
    Constants.expoConfig?.hostUri ||
    (Constants as any).manifest?.debuggerHost ||
    (Constants as any).manifest2?.extra?.expoClient?.hostUri;

  if (hostUri) {
    const ip = hostUri.split(':')[0];
    if (ip && ip !== 'localhost' && ip !== '127.0.0.1') {
      return `http://${ip}:8000/api/v1`;
    }
  }

  // 4. Android Emulator loopback fallback
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:8000/api/v1';
  }

  // 5. iOS Simulator / Default
  return 'http://localhost:8000/api/v1';
};

export const API_CONFIG = {
  BASE_URL: getApiBaseUrl(),
  DEFAULT_TIMEOUT_MS: 10000,
  AI_VOICE_TIMEOUT_MS: 30000,
};

export default API_CONFIG;
