import { runInTransaction } from "../config/database.js";
import { deviceRepository } from "../repositories/deviceRepository.js";
import { logRepository } from "../repositories/logRepository.js";
import type { Device, DeviceAction, DeviceRow } from "../types/device.js";
import { HttpError } from "../utils/httpError.js";
import { toIsoTimestamp } from "../utils/timestamp.js";

const actionSet = new Set<DeviceAction>(["start", "stop", "warning_on", "warning_off"]);

const actionLabels: Record<DeviceAction, string> = {
  start: "启动",
  stop: "停止",
  warning_on: "开启警示",
  warning_off: "关闭警示"
};

const toDevice = (row: DeviceRow): Device => ({
  id: row.id,
  name: row.name,
  runStatus: row.run_status,
  warningStatus: row.warning_status === 1,
  lastAction: row.last_action,
  createdAt: toIsoTimestamp(row.created_at),
  updatedAt: toIsoTimestamp(row.updated_at)
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

  runAction(deviceId: number, action: string, operator?: string): { device: Device } {
    if (!actionSet.has(action as DeviceAction)) {
      throw new HttpError(400, "不支持的设备操作。");
    }

    const normalizedAction = action as DeviceAction;

    // 设备状态更新和操作日志写入必须同时成功或同时回滚。
    const updated = runInTransaction(() => {
      const row = deviceRepository.updateAction(deviceId, getUpdateForAction(normalizedAction));

      if (!row) {
        throw new HttpError(404, "设备不存在。");
      }

      const operatorSuffix = operator ? `（操作人：${operator}）` : "";
      logRepository.create({
        deviceId,
        action: normalizedAction,
        detail: `模拟设备操作：${actionLabels[normalizedAction]}${operatorSuffix}`
      });

      return row;
    });

    return {
      device: toDevice(updated)
    };
  }
};
