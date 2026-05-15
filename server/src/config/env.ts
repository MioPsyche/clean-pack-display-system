import path from "node:path";

import dotenv from "dotenv";

dotenv.config();

const parsePort = (value: string | undefined): number => {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : 3001;
};

export const env = {
  port: parsePort(process.env.PORT),
  databasePath: path.resolve(process.cwd(), process.env.DATABASE_PATH ?? "./data/app.sqlite"),
  jwtSecret: process.env.JWT_SECRET ?? "local-demo-secret-change-before-production",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? "7d",
  corsOrigin: process.env.CORS_ORIGIN ?? "http://localhost:5173"
};
