export const STORAGE_KEYS = {
  demoBookings: 'leaf_clean_demo_bookings',
  inquiries: 'leaf_clean_inquiries',
} as const;

export function readStorageList<T>(key: string): T[] {
  try {
    const rawValue = window.localStorage.getItem(key);
    if (!rawValue) {
      return [];
    }

    const parsed = JSON.parse(rawValue);
    return Array.isArray(parsed) ? (parsed as T[]) : [];
  } catch {
    return [];
  }
}

export function writeStorageList<T>(key: string, value: T[]) {
  window.localStorage.setItem(key, JSON.stringify(value));
}

// New records are prepended so the admin dashboard shows latest submissions first.
export function prependStorageRecord<T>(key: string, record: T) {
  const current = readStorageList<T>(key);
  writeStorageList(key, [record, ...current]);
}

export function removeStorageKeys(keys: string[]) {
  keys.forEach((key) => window.localStorage.removeItem(key));
}
