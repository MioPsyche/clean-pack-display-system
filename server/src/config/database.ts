import fs from "node:fs";
import path from "node:path";

import Database from "better-sqlite3";

import { env } from "./env.js";
import { createSchema } from "../db/schema.js";
import { seedDefaultDevices } from "../db/seed.js";

fs.mkdirSync(path.dirname(env.databasePath), { recursive: true });

export const db = new Database(env.databasePath);

export const initializeDatabase = (): void => {
  db.pragma("foreign_keys = ON");
  db.pragma("journal_mode = WAL");
  createSchema(db);
  seedDefaultDevices(db);
};
