/**
 * Sakhi Authentication Service.
 *
 * Manages JWT session tokens, member registration, credential verification,
 * authenticated profile retrieval, and session termination.
 */

import { apiClient } from './apiClient';
import { tokenStorage } from './tokenStorage';
import {
  LoginPayload,
  RegisterPayload,
  TokenResponse,
  RefreshTokenResponse,
  LogoutResponse,
} from '@/types/auth';
import { UserResponse } from '@/types/api';

class AuthService {
  /**
   * Authenticate with mobile number and password.
   */
  public async login(payload: LoginPayload): Promise<TokenResponse> {
    const data = await apiClient.post<TokenResponse>('/auth/login', payload);

    if (data?.access_token) {
      await tokenStorage.setAccessToken(data.access_token);
      apiClient.setAuthToken(data.access_token);

      if (data.refresh_token) {
        await tokenStorage.setRefreshToken(data.refresh_token);
      }
    }

    return data;
  }

  /**
   * Register a new member account with credentials.
   */
  public async register(payload: RegisterPayload): Promise<TokenResponse> {
    const data = await apiClient.post<TokenResponse>('/auth/register', payload);

    if (data?.access_token) {
      await tokenStorage.setAccessToken(data.access_token);
      apiClient.setAuthToken(data.access_token);

      if (data.refresh_token) {
        await tokenStorage.setRefreshToken(data.refresh_token);
      }
    }

    return data;
  }

  /**
   * Fetch profile of the currently authenticated member.
   */
  public async getMe(): Promise<UserResponse> {
    return apiClient.get<UserResponse>('/auth/me');
  }

  /**
   * Renew expired access token using stored refresh token.
   */
  public async refreshSession(): Promise<string | null> {
    const refreshToken = await tokenStorage.getRefreshToken();
    if (__DEV__) {
      console.log(`[Auth] refresh_attempted=true, refresh_token_exists=${Boolean(refreshToken)}`);
    }
    if (!refreshToken) {
      return null;
    }

    try {
      // Clear access token before refresh request so stale Authorization header is not sent
      apiClient.setAuthToken(null);
      const data = await apiClient.post<RefreshTokenResponse>('/auth/refresh', {
        refresh_token: refreshToken,
      });

      if (data?.access_token) {
        await tokenStorage.setAccessToken(data.access_token);
        apiClient.setAuthToken(data.access_token);
        return data.access_token;
      }
      return null;
    } catch (err: any) {
      if (__DEV__) {
        console.warn(`[Auth] Token refresh failed: ${err?.message || 'unknown error'}`);
        console.log('[Auth] session_clearing_triggered=true');
      }
      await tokenStorage.clearAllTokens();
      apiClient.setAuthToken(null);
      return null;
    }
  }

  /**
   * Bootstrap authentication state on app launch.
   */
  public async restoreSession(): Promise<UserResponse | null> {
    if (__DEV__) {
      console.log('[Auth] session_initialization_running=true');
    }

    const token = await tokenStorage.getAccessToken();
    const hasToken = Boolean(token);
    if (__DEV__) {
      console.log(`[Auth] access_token_exists=${hasToken}`);
    }

    if (!token) {
      return null;
    }

    apiClient.setAuthToken(token);

    try {
      const user = await this.getMe();
      return user;
    } catch (err: any) {
      if (__DEV__) {
        console.log(`[Auth] /auth/me verification failed: ${err?.message || 'invalid token'}, attempting refresh`);
      }
      // Attempt token refresh
      const refreshedToken = await this.refreshSession();
      if (refreshedToken) {
        try {
          return await this.getMe();
        } catch (retryErr: any) {
          if (__DEV__) {
            console.warn(`[Auth] Retry /auth/me failed after refresh: ${retryErr?.message || 'error'}`);
            console.log('[Auth] session_clearing_triggered=true');
          }
          await tokenStorage.clearAllTokens();
          apiClient.setAuthToken(null);
          return null;
        }
      }

      if (__DEV__) {
        console.log('[Auth] session_clearing_triggered=true (refresh returned null)');
      }
      await tokenStorage.clearAllTokens();
      apiClient.setAuthToken(null);
      return null;
    }
  }

  /**
   * Terminate current authenticated session.
   */
  public async logout(): Promise<void> {
    if (__DEV__) {
      console.log('[Auth] session_clearing_triggered=true (user logout)');
    }
    try {
      await apiClient.post<LogoutResponse>('/auth/logout');
    } catch (err: any) {
      if (__DEV__) {
        console.warn(`[Auth] Logout API request failed (clearing local session anyway): ${err?.message || 'error'}`);
      }
    } finally {
      await tokenStorage.clearAllTokens();
      apiClient.setAuthToken(null);
    }
  }
}

export const authService = new AuthService();
export default authService;
