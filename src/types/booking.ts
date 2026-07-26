export type DemoBookingRecord = {
  id: string;
  /** 后端数据库主键；仅来自后端 API 的记录携带，用于单条删除 */
  backendId?: number;
  name: string;
  phone: string;
  organization?: string;
  preferredDate?: string;
  message?: string;
  createdAt: string;
};
