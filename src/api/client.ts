const DEFAULT_API_BASE_URL = 'http://localhost:3001';

export const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL ?? DEFAULT_API_BASE_URL
).replace(/\/+$/, '');

export const AUTH_TOKEN_KEY = 'leaf_clean_auth_token';
export const LOCAL_DEMO_TOKEN = 'local-demo-token';

const REQUEST_TIMEOUT_MS = 8000;

type ApiEnvelope<T> = {
  success?: boolean;
  data?: T;
  message?: string;
};

type ApiRequestOptions = RequestInit & {
  auth?: boolean;
};

export class ApiError extends Error {
  /** HTTP 状态码；0 表示网络层失败（后端不可达、超时、响应不是 JSON） */
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

export function isUnreachableError(error: unknown): error is ApiError {
  return error instanceof ApiError && error.status === 0;
}

export function isAuthError(error: unknown): error is ApiError {
  return error instanceof ApiError && error.status === 401;
}

export function getAuthToken() {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    return window.localStorage.getItem(AUTH_TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setAuthToken(token: string) {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    window.localStorage.setItem(AUTH_TOKEN_KEY, token);
  } catch {
    // 浏览器禁用存储时无法保留登录态，调用方会因 hasAuthSession() 为 false 回到登录页
  }
}

export function clearAuthToken() {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    window.localStorage.removeItem(AUTH_TOKEN_KEY);
  } catch {
    // 忽略存储不可用
  }
}

// https 页面请求 http://localhost 属于混合内容，浏览器必然拦截，
// 且 localhost 指向访问者自己的电脑：直接判定后端不可达，避免误导性的报错。
function isApiKnownUnreachable() {
  return (
    typeof window !== 'undefined' &&
    window.location.protocol === 'https:' &&
    API_BASE_URL.startsWith('http://localhost')
  );
}

export async function apiRequest<T>(path: string, options: ApiRequestOptions = {}): Promise<T> {
  const { auth = false, headers, ...requestOptions } = options;

  if (isApiKnownUnreachable()) {
    throw new ApiError('当前部署未配置后端 API 地址，无法连接后端服务', 0);
  }

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

  let response: Response;
  let text: string;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...requestOptions,
      headers: requestHeaders,
      signal: requestOptions.signal ?? AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
    text = await response.text();
  } catch {
    throw new ApiError('无法连接后端服务或请求超时', 0);
  }

  let payload: ApiEnvelope<T> | undefined;

  if (text) {
    try {
      payload = JSON.parse(text) as ApiEnvelope<T>;
    } catch {
      throw new ApiError('后端响应不是合法的 JSON', 0);
    }
  }

  // 带凭证的请求返回 401 说明会话已失效，清掉过期 token（本地演示 token 除外）
  if (auth && response.status === 401 && getAuthToken() !== LOCAL_DEMO_TOKEN) {
    clearAuthToken();
  }

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
