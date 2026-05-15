import { deviceRepository } from "../repositories/deviceRepository.js";
import { logRepository } from "../repositories/logRepository.js";
import type { Device, DeviceAction, DeviceRow } from "../types/device.js";
import { HttpError } from "../utils/httpError.js";

const actionSet = new Set<DeviceAction>(["start", "stop", "warning_on", "warning_off"]);

const toDevice = (row: DeviceRow): Device => ({
  id: row.id,
  name: row.name,
  runStatus: row.run_status,
  warningStatus: row.warning_status === 1,
  lastAction: row.last_action,
  createdAt: row.created_at,
  updatedAt: row.updated_at
});

const getUpdateForAction = (action: DeviceAction) => {
  switch (action) {
    case "start":
      return { runStatus: "running", lastAction: action };
    case "stop":
      return { runStatus: "stopped", lastAction: action };
    case "warning_on":
      return { warningStatus: 1, lastAction: action };
    case "warning_off":
      return { warningStatus: 0, lastAction: action };
  }
};

export const deviceService = {
  list(): Device[] {
    return deviceRepository.list().map(toDevice);
  },

  runAction(deviceId: number, action: string): { device: Device } {
    if (!actionSet.has(action as DeviceAction)) {
      throw new HttpError(400, "Unsupported device action.");
    }

    const normalizedAction = action as DeviceAction;
    const updated = deviceRepository.updateAction(deviceId, getUpdateForAction(normalizedAction));

    if (!updated) {
      throw new HttpError(404, "Device not found.");
    }

    logRepository.create({
      deviceId,
      action: normalizedAction,
      detail: `Simulated device action: ${normalizedAction}`
    });

    return {
      device: toDevice(updated)
    };
  }
};
