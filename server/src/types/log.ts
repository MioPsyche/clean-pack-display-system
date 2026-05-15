export interface OperationLogInput {
  deviceId?: number;
  action: string;
  detail?: string;
}

export interface OperationLogRow {
  id: number;
  device_id: number | null;
  action: string;
  detail: string | null;
  created_at: string;
}

export interface OperationLog {
  id: number;
  deviceId: number | null;
  action: string;
  detail: string | null;
  createdAt: string;
}
