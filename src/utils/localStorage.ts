export const STORAGE_KEYS = {
  demoBookings: 'leaf_clean_demo_bookings',
  inquiries: 'leaf_clean_inquiries',
} as const;

// 本地演示记录的最小结构校验：过滤被手动改坏的数据，避免表格渲染崩溃。
// 当前存储的记录（预约/询价）都满足 id/name/phone/createdAt 为字符串。
function isStoredRecord(item: unknown): boolean {
  if (typeof item !== 'object' || item === null) {
    return false;
  }

  const record = item as Record<string, unknown>;
  return (
    typeof record.id === 'string' &&
    typeof record.name === 'string' &&
    typeof record.phone === 'string' &&
    typeof record.createdAt === 'string'
  );
}

export function readStorageList<T>(key: string): T[] {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const rawValue = window.localStorage.getItem(key);
    if (!rawValue) {
      return [];
    }

    const parsed: unknown = JSON.parse(rawValue);
    return Array.isArray(parsed) ? (parsed.filter(isStoredRecord) as T[]) : [];
  } catch {
    return [];
  }
}

// 写入失败（配额、无痕模式等）会抛出异常，由调用方决定如何提示用户
export function writeStorageList<T>(key: string, value: T[]) {
  window.localStorage.setItem(key, JSON.stringify(value));
}

// New records are prepended so the admin dashboard shows latest submissions first.
export function prependStorageRecord<T>(key: string, record: T) {
  const current = readStorageList<T>(key);
  writeStorageList(key, [record, ...current]);
}

export function removeStorageRecord(key: string, id: string) {
  const current = readStorageList<{ id: string }>(key);
  writeStorageList(
    key,
    current.filter((record) => record.id !== id),
  );
}

export function removeStorageKeys(keys: string[]) {
  if (typeof window === 'undefined') {
    return;
  }

  keys.forEach((key) => {
    try {
      window.localStorage.removeItem(key);
    } catch {
      // 忽略存储不可用
    }
  });
}
