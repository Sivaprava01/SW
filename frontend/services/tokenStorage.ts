/**
 * Sakhi Cross-Platform Secure Token Storage.
 *
 * Uses Expo SecureStore (hardware-backed Keychain on iOS / EncryptedSharedPreferences on Android)
 * on native mobile platforms, and standard localStorage on Web.
 */

import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

const ACCESS_TOKEN_KEY = 'sakhi_access_token';
const REFRESH_TOKEN_KEY = 'sakhi_refresh_token';

class TokenStorage {
  private inMemoryAccessToken: string | null = null;
  private inMemoryRefreshToken: string | null = null;

  /**
   * Retrieve JWT access token from secure storage.
   */
  public async getAccessToken(): Promise<string | null> {
    if (this.inMemoryAccessToken) {
      return this.inMemoryAccessToken;
    }

    try {
      if (Platform.OS === 'web') {
        if (typeof window !== 'undefined' && window.localStorage) {
          const token = window.localStorage.getItem(ACCESS_TOKEN_KEY);
          this.inMemoryAccessToken = token;
          return token;
        }
        return this.inMemoryAccessToken;
      } else {
        const token = await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
        this.inMemoryAccessToken = token;
        return token;
      }
    } catch (err) {
      if (__DEV__) console.warn('[TokenStorage] Error reading access token:', err);
      return this.inMemoryAccessToken;
    }
  }

  /**
   * Persist JWT access token to secure storage.
   */
  public async setAccessToken(token: string): Promise<void> {
    this.inMemoryAccessToken = token;
    try {
      if (Platform.OS === 'web') {
        if (typeof window !== 'undefined' && window.localStorage) {
          window.localStorage.setItem(ACCESS_TOKEN_KEY, token);
        }
      } else {
        await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, token);
      }
    } catch (err) {
      if (__DEV__) console.warn('[TokenStorage] Error storing access token:', err);
    }
  }

  /**
   * Retrieve JWT refresh token from secure storage.
   */
  public async getRefreshToken(): Promise<string | null> {
    if (this.inMemoryRefreshToken) {
      return this.inMemoryRefreshToken;
    }

    try {
      if (Platform.OS === 'web') {
        if (typeof window !== 'undefined' && window.localStorage) {
          const token = window.localStorage.getItem(REFRESH_TOKEN_KEY);
          this.inMemoryRefreshToken = token;
          return token;
        }
        return this.inMemoryRefreshToken;
      } else {
        const token = await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
        this.inMemoryRefreshToken = token;
        return token;
      }
    } catch (err) {
      if (__DEV__) console.warn('[TokenStorage] Error reading refresh token:', err);
      return this.inMemoryRefreshToken;
    }
  }

  /**
   * Persist JWT refresh token to secure storage.
   */
  public async setRefreshToken(token: string): Promise<void> {
    this.inMemoryRefreshToken = token;
    try {
      if (Platform.OS === 'web') {
        if (typeof window !== 'undefined' && window.localStorage) {
          window.localStorage.setItem(REFRESH_TOKEN_KEY, token);
        }
      } else {
        await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, token);
      }
    } catch (err) {
      if (__DEV__) console.warn('[TokenStorage] Error storing refresh token:', err);
    }
  }

  /**
   * Clear all persisted and in-memory tokens on logout.
   */
  public async clearAllTokens(): Promise<void> {
    this.inMemoryAccessToken = null;
    this.inMemoryRefreshToken = null;

    try {
      if (Platform.OS === 'web') {
        if (typeof window !== 'undefined' && window.localStorage) {
          window.localStorage.removeItem(ACCESS_TOKEN_KEY);
          window.localStorage.removeItem(REFRESH_TOKEN_KEY);
        }
      } else {
        await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
        await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
      }
    } catch (err) {
      if (__DEV__) console.warn('[TokenStorage] Error clearing tokens:', err);
    }
  }
}

export const tokenStorage = new TokenStorage();
export default tokenStorage;
