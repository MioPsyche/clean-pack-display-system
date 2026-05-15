const DEFAULT_API_BASE_URL = 'http://localhost:3001';

export const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL ?? DEFAULT_API_BASE_URL
).replace(/\/+$/, '');

export const AUTH_TOKEN_KEY = 'leaf_clean_auth_token';

type ApiEnvelope<T> = {
  success?: boolean;
  data?: T;
  message?: string;
};

type ApiRequestOptions = RequestInit & {
  auth?: boolean;
};

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

export function getAuthToken() {
  if (typeof window === 'undefined') {
    return null;
  }

  return window.localStorage.getItem(AUTH_TOKEN_KEY);
}

export function setAuthToken(token: string) {
  window.localStorage.setItem(AUTH_TOKEN_KEY, token);
}

export function clearAuthToken() {
  window.localStorage.removeItem(AUTH_TOKEN_KEY);
}

export async function apiRequest<T>(path: string, options: ApiRequestOptions = {}): Promise<T> {
  const { auth = false, headers, ...requestOptions } = options;
  const requestHeaders = new Headers(headers);

  if (requestOptions.body && !requestHeaders.has('Content-Type')) {
    requestHeaders.set('Content-Type', 'application/json');
  }

  if (auth) {
    const token = getAuthToken();
    if (token) {
      requestHeaders.set('Authorization', `Bearer ${token}`);
    }
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...requestOptions,
    headers: requestHeaders,
  });

  const text = await response.text();
  const payload = text ? (JSON.parse(text) as ApiEnvelope<T>) : undefined;

  if (!response.ok) {
    throw new ApiError(payload?.message ?? '后端请求失败', response.status);
  }

  if (payload && payload.success === false) {
    throw new ApiError(payload.message ?? '后端请求失败', response.status);
  }

  if (payload && 'data' in payload) {
    return payload.data as T;
  }

  return payload as T;
}
