const SQLITE_DATETIME_PATTERN = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/;

// SQLite 的 CURRENT_TIMESTAMP 产生 "YYYY-MM-DD HH:MM:SS"（UTC、无时区标记），
// 直接下发会被浏览器按本地时间解析，统一转成 ISO-8601 再返回。
export const toIsoTimestamp = (value: string): string => {
  const normalized = SQLITE_DATETIME_PATTERN.test(value) ? `${value.replace(" ", "T")}Z` : value;
  const parsed = new Date(normalized);
  return Number.isNaN(parsed.getTime()) ? value : parsed.toISOString();
};
