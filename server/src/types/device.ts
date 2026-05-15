export type DeviceAction = "start" | "stop" | "warning_on" | "warning_off";

export interface DeviceRow {
  id: number;
  name: string;
  run_status: string;
  warning_status: number;
  last_action: string | null;
  created_at: string;
  updated_at: string;
}

export interface Device {
  id: number;
  name: string;
  runStatus: string;
  warningStatus: boolean;
  lastAction: string | null;
  createdAt: string;
  updatedAt: string;
}
