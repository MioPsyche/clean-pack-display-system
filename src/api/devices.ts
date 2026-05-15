import { apiRequest } from './client';

export type DeviceAction = 'start' | 'stop' | 'warning_on' | 'warning_off';

export type Device = {
  id: number;
  name: string;
  runStatus: string;
  warningStatus: boolean;
  lastAction: DeviceAction | string | null;
  createdAt: string;
  updatedAt: string;
};

export type OperationLog = {
  id: number;
  deviceId: number | null;
  action: string;
  detail: string | null;
  createdAt: string;
};

export function fetchDevices() {
  return apiRequest<Device[]>('/api/devices');
}

export function runDeviceAction(deviceId: number, action: DeviceAction) {
  return apiRequest<{ device: Device }>(`/api/devices/${deviceId}/action`, {
    method: 'POST',
    auth: true,
    body: JSON.stringify({ action }),
  });
}

export function fetchOperationLogs() {
  return apiRequest<OperationLog[]>('/api/operation-logs', { auth: true });
}
