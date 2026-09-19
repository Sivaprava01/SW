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
   * Note: This does NOT delete account-specific UX persistence flags (e.g. tour completion).
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

  /**
   * Check if the account has completed/seen the interactive tour.
   */
  public async getTourCompleted(userId: number): Promise<boolean> {
    const key = `sakhi_tour_completed_${userId}`;
    try {
      if (Platform.OS === 'web') {
        if (typeof window !== 'undefined' && window.localStorage) {
          return window.localStorage.getItem(key) === 'true';
        }
        return false;
      } else {
        const val = await SecureStore.getItemAsync(key);
        return val === 'true';
      }
    } catch (err) {
      if (__DEV__) console.warn('[TokenStorage] Error reading tour completion:', err);
      return false;
    }
  }

  /**
   * Persist tour completion for a specific account.
   */
  public async setTourCompleted(userId: number, completed: boolean = true): Promise<void> {
    const key = `sakhi_tour_completed_${userId}`;
    try {
      if (Platform.OS === 'web') {
        if (typeof window !== 'undefined' && window.localStorage) {
          window.localStorage.setItem(key, completed ? 'true' : 'false');
        }
      } else {
        await SecureStore.setItemAsync(key, completed ? 'true' : 'false');
      }
    } catch (err) {
      if (__DEV__) console.warn('[TokenStorage] Error saving tour completion:', err);
    }
  }

  /**
   * Reset tour completion for a specific account (e.g. for intentional manual replay).
   */
  public async resetTourCompleted(userId: number): Promise<void> {
    const key = `sakhi_tour_completed_${userId}`;
    try {
      if (Platform.OS === 'web') {
        if (typeof window !== 'undefined' && window.localStorage) {
          window.localStorage.removeItem(key);
        }
      } else {
        await SecureStore.deleteItemAsync(key);
      }
    } catch (err) {
      if (__DEV__) console.warn('[TokenStorage] Error resetting tour completion:', err);
    }
  }
}

export const tokenStorage = new TokenStorage();
export default tokenStorage;
