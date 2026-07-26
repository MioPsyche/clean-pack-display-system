import {
  apiRequest,
  clearAuthToken,
  getAuthToken,
  LOCAL_DEMO_TOKEN,
  setAuthToken,
} from './client';

const AUTH_USER_KEY = 'leaf_clean_auth_user';

export type AuthUser = {
  id: number;
  username: string;
  role: string;
  createdAt?: string;
};

export type AuthSession = {
  user: AuthUser;
  token: string;
};

export type AuthPayload = {
  username: string;
  password: string;
};

export function saveAuthSession(session: AuthSession) {
  setAuthToken(session.token);

  try {
    window.localStorage.setItem(AUTH_USER_KEY, JSON.stringify(session.user));
  } catch {
    // 存储不可用时仅影响用户名展示
  }
}

export function clearAuthSession() {
  clearAuthToken();

  try {
    window.localStorage.removeItem(AUTH_USER_KEY);
  } catch {
    // 忽略存储不可用
  }
}

// 解析 JWT 的过期时间（毫秒）；不是 JWT（如本地演示 token）时返回 null
function decodeJwtExpiry(token: string): number | null {
  const parts = token.split('.');

  if (parts.length !== 3) {
    return null;
  }

  try {
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=');
    const payload = JSON.parse(window.atob(padded)) as { exp?: unknown };
    return typeof payload.exp === 'number' ? payload.exp * 1000 : null;
  } catch {
    return null;
  }
}

export function hasAuthSession() {
  const token = getAuthToken();

  if (!token) {
    return false;
  }

  const expiresAt = decodeJwtExpiry(token);

  if (expiresAt !== null && expiresAt <= Date.now()) {
    // JWT 已过期：清理会话让用户重新登录，而不是进入后台后所有请求 401
    clearAuthSession();
    return false;
  }

  return true;
}

export function isLocalDemoSession() {
  return getAuthToken() === LOCAL_DEMO_TOKEN;
}

export function getStoredUser(): AuthUser | null {
  try {
    const rawValue = window.localStorage.getItem(AUTH_USER_KEY);
    return rawValue ? (JSON.parse(rawValue) as AuthUser) : null;
  } catch {
    return null;
  }
}

export function createLocalDemoSession() {
  saveAuthSession({
    token: LOCAL_DEMO_TOKEN,
    user: {
      id: 0,
      username: 'local-demo',
      role: 'demo',
      createdAt: new Date().toISOString(),
    },
  });
}

export async function login(payload: AuthPayload) {
  const session = await apiRequest<AuthSession>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  saveAuthSession(session);
  return session;
}

export async function register(payload: AuthPayload) {
  const session = await apiRequest<AuthSession>('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  saveAuthSession(session);
  return session;
}
