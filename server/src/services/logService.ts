import { logRepository } from "../repositories/logRepository.js";
import type { OperationLog, OperationLogRow } from "../types/log.js";
import { toIsoTimestamp } from "../utils/timestamp.js";

const toOperationLog = (row: OperationLogRow): OperationLog => ({
  id: row.id,
  deviceId: row.device_id,
  action: row.action,
  detail: row.detail,
  createdAt: toIsoTimestamp(row.created_at)
});

export const logService = {
  list(): OperationLog[] {
    return logRepository.list().map(toOperationLog);
  }
};
