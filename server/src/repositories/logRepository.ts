import { db } from "../config/database.js";
import type { OperationLogInput, OperationLogRow } from "../types/log.js";

export const logRepository = {
  list(): OperationLogRow[] {
    return db.prepare("SELECT * FROM operation_logs ORDER BY created_at DESC, id DESC").all() as OperationLogRow[];
  },

  create(input: OperationLogInput): OperationLogRow {
    const result = db
      .prepare("INSERT INTO operation_logs (device_id, action, detail) VALUES (?, ?, ?)")
      .run(input.deviceId ?? null, input.action, input.detail ?? null);

    return db.prepare("SELECT * FROM operation_logs WHERE id = ?").get(Number(result.lastInsertRowid)) as OperationLogRow;
  }
};
