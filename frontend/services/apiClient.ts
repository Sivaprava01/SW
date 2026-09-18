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
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
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

    // Automatically inject JWT Bearer Authorization header if token is set
    if (this.authToken && !headers['Authorization']) {
      headers['Authorization'] = `Bearer ${this.authToken}`;
    }

    if (__DEV__) {
      console.log(`[API Request] ${fetchOptions.method || 'GET'} ${url}`);
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
          if (typeof data.detail === 'string') {
            errorMessage = data.detail;
          } else if (Array.isArray(data.detail)) {
            errorMessage = data.detail.map((d: any) => d.msg || JSON.stringify(d)).join(', ');
          } else if (data.message) {
            errorMessage = data.message;
          }
        }
        throw new ApiError(errorMessage, response.status, data);
      }

      return data as T;
    } catch (error: any) {
      clearTimeout(timer);

      if (error.name === 'AbortError') {
        const timeoutError = new ApiError(
          `Request timed out after ${timeoutMs / 1000}s`,
          408
        );
        if (__DEV__) {
          console.warn(`[API Timeout] ${url}`, timeoutError);
        }
        throw timeoutError;
      }

      if (error instanceof ApiError) {
        throw error;
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
