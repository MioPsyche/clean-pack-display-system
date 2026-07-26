import { db } from "../config/database.js";
import type { UserRow } from "../types/auth.js";
import { HttpError } from "../utils/httpError.js";

const mapUserRow = (row: unknown): UserRow | null => {
  return row ? (row as UserRow) : null;
};

export const userRepository = {
  create(username: string, passwordHash: string, role = "admin"): UserRow {
    const result = db
      .prepare("INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?)")
      .run(username, passwordHash, role);

    const created = userRepository.findById(Number(result.lastInsertRowid));

    if (!created) {
      throw new HttpError(500, "用户创建失败，请稍后重试。");
    }

    return created;
  },

  findByUsername(username: string): UserRow | null {
    const row = db.prepare("SELECT * FROM users WHERE username = ?").get(username);
    return mapUserRow(row);
  },

  findById(id: number): UserRow | null {
    const row = db.prepare("SELECT * FROM users WHERE id = ?").get(id);
    return mapUserRow(row);
  }
};
