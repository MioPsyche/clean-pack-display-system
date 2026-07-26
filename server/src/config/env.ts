import path from "node:path";

import dotenv from "dotenv";

dotenv.config();

const DEFAULT_JWT_SECRET = "local-demo-secret-change-before-production";
const DEFAULT_JWT_EXPIRES_IN = "7d";

const parsePort = (value: string | undefined): number => {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : 3001;
};

const resolveJwtSecret = (): string => {
  if (process.env.JWT_SECRET) {
    return process.env.JWT_SECRET;
  }

  if (process.env.NODE_ENV === "production") {
    console.error("[env] 未配置 JWT_SECRET，生产环境禁止使用默认密钥启动。");
    process.exit(1);
  }

  console.warn("[env] 未配置 JWT_SECRET，正在使用本地演示默认密钥（仅限本地演示，勿用于线上）。");
  return DEFAULT_JWT_SECRET;
};

const resolveJwtExpiresIn = (value: string | undefined): string => {
  if (!value) {
    return DEFAULT_JWT_EXPIRES_IN;
  }

  const normalized = value.trim();

  if (!/^\d+\s*(ms|s|m|h|d|w|y)?$/i.test(normalized)) {
    console.warn(`[env] JWT_EXPIRES_IN="${value}" 格式无效，已回退为 ${DEFAULT_JWT_EXPIRES_IN}。`);
    return DEFAULT_JWT_EXPIRES_IN;
  }

  return normalized;
};

export const env = {
  port: parsePort(process.env.PORT),
  databasePath: path.resolve(process.cwd(), process.env.DATABASE_PATH ?? "./data/app.sqlite"),
  jwtSecret: resolveJwtSecret(),
  jwtExpiresIn: resolveJwtExpiresIn(process.env.JWT_EXPIRES_IN),
  corsOrigin: process.env.CORS_ORIGIN ?? "http://localhost:5173"
};
