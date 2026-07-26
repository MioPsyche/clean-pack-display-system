export type InquiryRecord = {
  id: string;
  /** 后端数据库主键；仅来自后端 API 的记录携带，用于单条删除 */
  backendId?: number;
  name: string;
  phone: string;
  organization?: string;
  expectedScenario?: string;
  budgetRange?: string;
  message?: string;
  createdAt: string;
};
