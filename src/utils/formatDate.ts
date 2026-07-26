const SQLITE_DATETIME_PATTERN = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/;

// 兼容两种来源的时间字符串：
// - SQLite 旧格式 "YYYY-MM-DD HH:MM:SS"（UTC、无时区标记，直接 new Date 会被按本地时间解析）
// - 标准 ISO-8601（本地 localStorage 记录与 V1.1 后端）
export function parseTimestamp(value: string): Date | null {
  if (!value) {
    return null;
  }

  const normalized = SQLITE_DATETIME_PATTERN.test(value) ? `${value.replace(' ', 'T')}Z` : value;
  const date = new Date(normalized);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function formatDateTime(value: string, options: { withYear?: boolean } = {}): string {
  const date = parseTimestamp(value);

  if (!date) {
    return '—';
  }

  return new Intl.DateTimeFormat('zh-CN', {
    ...(options.withYear === false ? {} : { year: 'numeric' }),
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

export function timestampToMillis(value: string): number {
  return parseTimestamp(value)?.getTime() ?? 0;
}
