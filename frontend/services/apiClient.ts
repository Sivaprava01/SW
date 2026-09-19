import { API_CONFIG } from '@/constants/api';
import { ApiErrorDetail } from '@/types/api';

export class ApiError extends Error {
  status: number;
  raw: any;

  constructor(message: string, status: number, raw?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.raw = raw;
  }
}

export interface RequestOptions extends RequestInit {
  timeoutMs?: number;
  params?: Record<string, string | number | boolean | undefined | null>;
}

class ApiClient {
  private baseUrl: string;
  private authToken: string | null = null;

  constructor(baseUrl: string = API_CONFIG.BASE_URL) {
    this.baseUrl = baseUrl;
  }

  public setBaseUrl(newUrl: string) {
    this.baseUrl = newUrl;
  }

  public getBaseUrl(): string {
    return this.baseUrl;
  }

  public setAuthToken(token: string | null) {
    this.authToken = token;
  }

  public getAuthToken(): string | null {
    return this.authToken;
  }

  private buildUrl(path: string, params?: Record<string, string | number | boolean | undefined | null>): string {
    let cleanPath = path.startsWith('/') ? path : `/${path}`;
    if (this.baseUrl.endsWith('/api/v1') && cleanPath.startsWith('/api/v1/')) {
      cleanPath = cleanPath.substring('/api/v1'.length);
    }
    let url = `${this.baseUrl}${cleanPath}`;

    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value));
        }
      });
      const queryString = searchParams.toString();
      if (queryString) {
        url += (url.includes('?') ? '&' : '?') + queryString;
      }
    }

    return url;
  }

  private async request<T>(path: string, options: RequestOptions = {}): Promise<T> {
    const { timeoutMs = API_CONFIG.DEFAULT_TIMEOUT_MS, params, ...fetchOptions } = options;
    const url = this.buildUrl(path, params);

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    const headers: Record<string, string> = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...((fetchOptions.headers as Record<string, string>) || {}),
    };

    // Do not attach Bearer token to unauthenticated auth routes or health check
    const isPublicAuthRoute =
      path.includes('/auth/login') ||
      path.includes('/auth/register') ||
      path.includes('/auth/refresh') ||
      path.includes('/health');

    // Automatically inject JWT Bearer Authorization header if token is set and not a public route
    if (this.authToken && !headers['Authorization'] && !isPublicAuthRoute) {
      headers['Authorization'] = `Bearer ${this.authToken}`;
    }

    if (__DEV__) {
      const hasAuth = !!headers['Authorization'] || (!!this.authToken && !isPublicAuthRoute);
      console.log(`[API Request] ${fetchOptions.method || 'GET'} ${url} [auth_header_present=${hasAuth}]`);
    }

    try {
      const response = await fetch(url, {
        ...fetchOptions,
        headers,
        signal: controller.signal,
      });

      clearTimeout(timer);

      // 204 No Content
      if (response.status === 204) {
        if (__DEV__) {
          console.log(`[API Response] ${response.status} ${url} (No Content)`);
        }
        return null as unknown as T;
      }

      const contentType = response.headers.get('content-type') || '';
      let data: any = null;

      if (contentType.includes('application/json')) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      if (__DEV__) {
        console.log(`[API Response] ${response.status} ${url}`, data);
      }

      if (!response.ok) {
        let errorMessage = `HTTP Error ${response.status}`;
        if (data && typeof data === 'object') {
          if (data.error && typeof data.error === 'object') {
            if (typeof data.error.message === 'string') {
              errorMessage = data.error.message;
            }
            if (Array.isArray(data.error.details) && data.error.details.length > 0) {
              const fieldErrors = data.error.details
                .map((d: any) => (d.loc ? `${d.loc[d.loc.length - 1]}: ${d.msg}` : d.msg || JSON.stringify(d)))
                .join(', ');
              if (fieldErrors) {
                errorMessage = `${errorMessage} (${fieldErrors})`;
              }
            }
          } else if (typeof data.detail === 'string') {
            errorMessage = data.detail;
          } else if (Array.isArray(data.detail)) {
            errorMessage = data.detail
              .map((d: any) => (d.loc ? `${d.loc[d.loc.length - 1]}: ${d.msg}` : d.msg || JSON.stringify(d)))
              .join(', ');
          } else if (typeof data.message === 'string') {
            errorMessage = data.message;
          }
        }
        throw new ApiError(errorMessage, response.status, data);
      }

      return data as T;
    } catch (error: any) {
      clearTimeout(timer);

      if (error instanceof ApiError) {
        throw error;
      }

      const isCancellation =
        error.name === 'AbortError' ||
        (typeof error.message === 'string' &&
          (error.message.toLowerCase().includes('cancel') || error.message.toLowerCase().includes('aborted')));

      if (isCancellation) {
        const cancelError = new ApiError(
          error.message || 'Request was cancelled',
          499,
          error
        );
        if (__DEV__) {
          console.log(`[API Cancelled] ${url}: ${error.message || 'cancelled'}`);
        }
        throw cancelError;
      }

      const networkError = new ApiError(
        error.message || 'Network request failed. Is the backend server running?',
        0,
        error
      );
      if (__DEV__) {
        console.warn(`[API Network Error] ${url}`, networkError);
      }
      throw networkError;
    }
  }

  public get<T>(path: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(path, { ...options, method: 'GET' });
  }

  public post<T>(path: string, body?: any, options?: RequestOptions): Promise<T> {
    return this.request<T>(path, {
      ...options,
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  public patch<T>(path: string, body?: any, options?: RequestOptions): Promise<T> {
    return this.request<T>(path, {
      ...options,
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  public delete<T>(path: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(path, { ...options, method: 'DELETE' });
  }
}

export const apiClient = new ApiClient();
export default apiClient;
