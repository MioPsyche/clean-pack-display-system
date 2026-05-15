import jwt from "jsonwebtoken";

import { env } from "../config/env.js";
import type { AuthTokenPayload, AuthUser } from "../types/auth.js";

export const signAuthToken = (user: AuthUser): string => {
  const payload: AuthTokenPayload = {
    sub: String(user.id),
    username: user.username,
    role: user.role
  };

  return jwt.sign(payload, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn as jwt.SignOptions["expiresIn"]
  });
};

export const verifyAuthToken = (token: string): AuthUser => {
  const payload = jwt.verify(token, env.jwtSecret) as AuthTokenPayload;

  return {
    id: Number(payload.sub),
    username: payload.username,
    role: payload.role
  };
};
