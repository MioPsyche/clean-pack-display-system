import {
  apiRequest,
  clearAuthToken,
  getAuthToken,
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
  window.localStorage.setItem(AUTH_USER_KEY, JSON.stringify(session.user));
}

export function clearAuthSession() {
  clearAuthToken();
  window.localStorage.removeItem(AUTH_USER_KEY);
}

export function hasAuthSession() {
  return Boolean(getAuthToken());
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
    token: 'local-demo-token',
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
