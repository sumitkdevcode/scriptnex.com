const _rawBase = process.env.NEXT_PUBLIC_API_URL;

if (!_rawBase && typeof window !== 'undefined') {
  console.error(
    '[ScriptNex] NEXT_PUBLIC_API_URL is not set. API calls will fail. ' +
    'Please check your .env file and rebuild.'
  );
}

export const API_BASE = _rawBase || 'https://admin.scriptnex.com/api/v1';

/** Maximum number of cached GET responses to keep in memory */
const MAX_CACHE_SIZE = 100;
/** Default timeout for fetch requests (ms) */
const FETCH_TIMEOUT_MS = 15_000;

interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T;
  errors?: Record<string, string[]>;
  meta?: Record<string, unknown>;
}

interface GetOptions {
  force?: boolean;
}

class ApiClient {
  private baseUrl: string;
  private cache: Map<string, { data: any; expiry: number }> = new Map();

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  clearCache(endpoint?: string) {
    if (endpoint) {
      this.cache.delete(endpoint);
    } else {
      this.cache.clear();
    }
  }

  /**
   * Evict the oldest entries when the cache exceeds MAX_CACHE_SIZE.
   */
  private evictCache() {
    if (this.cache.size <= MAX_CACHE_SIZE) return;
    const now = Date.now();
    // First pass: remove expired entries
    for (const [key, entry] of this.cache) {
      if (entry.expiry <= now) {
        this.cache.delete(key);
      }
    }
    // Second pass: if still over limit, remove oldest entries
    if (this.cache.size > MAX_CACHE_SIZE) {
      const keysToDelete = Array.from(this.cache.keys()).slice(
        0,
        this.cache.size - MAX_CACHE_SIZE
      );
      for (const key of keysToDelete) {
        this.cache.delete(key);
      }
    }
  }

  private getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('auth_token');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const token = this.getToken();
    const isFormData = options.body instanceof FormData;
    
    const headers: Record<string, string> = {
      'Accept': 'application/json',
      ...(options.headers as Record<string, string> || {}),
    };

    if (!isFormData) {
      headers['Content-Type'] = 'application/json';
    }

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    // Add timeout via AbortController
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers,
        signal: controller.signal,
      });

      // Check content-type before parsing JSON to avoid SyntaxError on HTML error pages
      const contentType = response.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) {
        throw new ApiError(
          `Server returned non-JSON response (${response.status}). The server may be temporarily unavailable.`,
          response.status
        );
      }

      const data: ApiResponse<T> = await response.json();

      if (!response.ok || !data.success) {
        const errorMessage = data.message || `Request failed with status ${response.status}`;
        throw new ApiError(errorMessage, response.status, data.errors);
      }

      return data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      // Handle abort (timeout)
      if (error instanceof DOMException && error.name === 'AbortError') {
        throw new ApiError('Request timed out. Please check your connection.', 0);
      }
      // Network or parsing error
      throw new ApiError(
        error instanceof Error ? error.message : 'Network error occurred',
        0
      );
    } finally {
      clearTimeout(timeoutId);
    }
  }

  async get<T>(endpoint: string, options: GetOptions = {}): Promise<ApiResponse<T>> {
    if (!options.force) {
      const cached = this.cache.get(endpoint);
      if (cached && cached.expiry > Date.now()) {
        return cached.data;
      }
    }

    const data = await this.request<T>(endpoint, { method: 'GET' });
    this.cache.set(endpoint, { data, expiry: Date.now() + 30000 }); // Cache for 30s
    this.evictCache();
    return data;
  }

  async post<T>(endpoint: string, body?: unknown): Promise<ApiResponse<T>> {
    const result = await this.request<T>(endpoint, {
      method: 'POST',
      body: body instanceof FormData ? body : (body ? JSON.stringify(body) : undefined),
    });
    this.clearCache();
    return result;
  }

  async put<T>(endpoint: string, body?: unknown): Promise<ApiResponse<T>> {
    const result = await this.request<T>(endpoint, {
      method: 'PUT',
      body: body instanceof FormData ? body : (body ? JSON.stringify(body) : undefined),
    });
    this.clearCache();
    return result;
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    const result = await this.request<T>(endpoint, { method: 'DELETE' });
    this.clearCache();
    return result;
  }
}

export class ApiError extends Error {
  status: number;
  errors?: Record<string, string[]>;

  constructor(message: string, status: number, errors?: Record<string, string[]>) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.errors = errors;
  }
}

export const api = new ApiClient(API_BASE);
export type { ApiResponse };
