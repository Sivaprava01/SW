import { Platform, NativeModules } from 'react-native';
import Constants from 'expo-constants';

/**
 * Sakhi API Configuration Constants.
 *
 * Supports automatic local development resolution across platforms:
 * - Web Browser: dynamically targets window.location.hostname:8000
 * - Expo Go (Mobile Device/Dev Client): extracts Metro host IP from NativeModules or Constants (e.g. 172.16.x.x, 192.168.x.x)
 * - Android Emulator fallback: 10.0.2.2:8000
 * - Explicit Override: configured via EXPO_PUBLIC_API_URL
 */

export const getApiBaseUrl = (): string => {
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

  // 3. Native Dev: Resolve Metro bundle host IP from NativeModules.SourceCode.scriptURL
  // This is the most accurate representation of the host PC running Metro on physical devices
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

  // 4. Expo Go / Dev Client: inspect all possible hostUri locations in Constants
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

  // 5. Android Emulator loopback fallback
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:8000/api/v1';
  }

  // 6. iOS Simulator / Default
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

