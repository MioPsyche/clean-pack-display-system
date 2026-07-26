import { db } from "../config/database.js";
import type { DeviceAction, DeviceRow } from "../types/device.js";

interface DeviceUpdate {
  runStatus?: string;
  warningStatus?: number;
  lastAction: DeviceAction;
}

export const deviceRepository = {
  list(): DeviceRow[] {
    return db.prepare("SELECT * FROM devices ORDER BY id ASC").all() as DeviceRow[];
  },

  findById(id: number): DeviceRow | null {
    const row = db.prepare("SELECT * FROM devices WHERE id = ?").get(id);
    return row ? (row as DeviceRow) : null;
  },

  updateAction(id: number, update: DeviceUpdate): DeviceRow | null {
    const current = deviceRepository.findById(id);

    if (!current) {
      return null;
    }

    db.prepare(
      `
      UPDATE devices
      SET
        run_status = ?,
        warning_status = ?,
        last_action = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `
    ).run(update.runStatus ?? current.run_status, update.warningStatus ?? current.warning_status, update.lastAction, id);

    return deviceRepository.findById(id);
  }
};
