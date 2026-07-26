import { describe, expect, it } from 'vitest';
import { formatDateTime, parseTimestamp, timestampToMillis } from '../src/utils/formatDate';

describe('parseTimestamp', () => {
  it('把 SQLite 的 UTC 空格格式归一化为正确时刻', () => {
    const date = parseTimestamp('2026-05-20 11:22:33');
    expect(date?.toISOString()).toBe('2026-05-20T11:22:33.000Z');
  });

  it('ISO-8601 字符串按原义解析', () => {
    const date = parseTimestamp('2026-05-20T11:22:33.000Z');
    expect(date?.toISOString()).toBe('2026-05-20T11:22:33.000Z');
  });

  it('非法输入返回 null 而不是 Invalid Date', () => {
    expect(parseTimestamp('not-a-date')).toBeNull();
    expect(parseTimestamp('')).toBeNull();
  });
});

describe('formatDateTime', () => {
  it('非法时间显示为占位符而不是抛异常', () => {
    expect(formatDateTime('broken')).toBe('—');
    expect(formatDateTime('')).toBe('—');
  });

  it('默认输出包含年份', () => {
    expect(formatDateTime('2026-05-20T11:22:33.000Z')).toContain('2026');
  });

  it('withYear: false 时不输出年份', () => {
    expect(formatDateTime('2026-05-20T11:22:33.000Z', { withYear: false })).not.toContain('2026');
  });
});

describe('timestampToMillis', () => {
  it('非法时间归零，保证排序不产生 NaN', () => {
    expect(timestampToMillis('broken')).toBe(0);
  });

  it('SQLite 格式与 ISO 格式可以互相比较先后', () => {
    expect(timestampToMillis('2026-05-20 11:22:33')).toBeLessThan(
      timestampToMillis('2026-05-20T12:00:00Z'),
    );
  });
});
