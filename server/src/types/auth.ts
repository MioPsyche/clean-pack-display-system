export interface UserRow {
  id: number;
  username: string;
  password_hash: string;
  role: string;
  created_at: string;
  updated_at: string;
}

export interface PublicUser {
  id: number;
  username: string;
  role: string;
  createdAt: string;
}

export interface AuthUser {
  id: number;
  username: string;
  role: string;
}

export interface AuthTokenPayload {
  sub: string;
  username: string;
  role: string;
}
