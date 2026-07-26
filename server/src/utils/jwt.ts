import jwt from "jsonwebtoken";

import { env } from "../config/env.js";
import type { AuthTokenPayload, AuthUser } from "../types/auth.js";
import { HttpError } from "./httpError.js";

export const signAuthToken = (user: AuthUser): string => {
  const payload: AuthTokenPayload = {
    sub: String(user.id),
    username: user.username,
    role: user.role
  };

  return jwt.sign(payload, env.jwtSecret, {
    algorithm: "HS256",
    expiresIn: env.jwtExpiresIn as jwt.SignOptions["expiresIn"]
  });
};

export const verifyAuthToken = (token: string): AuthUser => {
  const payload = jwt.verify(token, env.jwtSecret, { algorithms: ["HS256"] });

  if (
    typeof payload === "string" ||
    typeof payload.sub !== "string" ||
    !/^\d+$/.test(payload.sub) ||
    typeof payload.username !== "string" ||
    typeof payload.role !== "string"
  ) {
    throw new HttpError(401, "登录凭证无效，请重新登录。");
  }

  return {
    id: Number(payload.sub),
    username: payload.username,
    role: payload.role
  };
};
