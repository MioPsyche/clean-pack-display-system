import { beforeEach, describe, expect, it } from 'vitest';
import {
  prependStorageRecord,
  readStorageList,
  removeStorageRecord,
  STORAGE_KEYS,
} from '../src/utils/localStorage';

type StoredRecord = {
  id: string;
  name: string;
  phone: string;
  createdAt: string;
};

const KEY = STORAGE_KEYS.demoBookings;

const buildRecord = (id: string): StoredRecord => ({
  id,
  name: '演示联系人',
  phone: '13800000000',
  createdAt: '2026-07-26T00:00:00.000Z',
});

beforeEach(() => {
  window.localStorage.clear();
});

describe('readStorageList', () => {
  it('没有数据时返回空数组', () => {
    expect(readStorageList(KEY)).toEqual([]);
  });

  it('内容不是数组时返回空数组', () => {
    window.localStorage.setItem(KEY, JSON.stringify({ hacked: true }));
    expect(readStorageList(KEY)).toEqual([]);
  });

  it('JSON 损坏时返回空数组而不是抛异常', () => {
    window.localStorage.setItem(KEY, '{broken json');
    expect(readStorageList(KEY)).toEqual([]);
  });

  it('过滤结构不完整的记录，避免渲染崩溃', () => {
    const good = buildRecord('demo-1');
    window.localStorage.setItem(KEY, JSON.stringify([good, null, {}, { id: 'x' }, 'text']));
    expect(readStorageList<StoredRecord>(KEY)).toEqual([good]);
  });
});

describe('prependStorageRecord', () => {
  it('新记录插入到列表头部', () => {
    prependStorageRecord(KEY, buildRecord('demo-1'));
    prependStorageRecord(KEY, buildRecord('demo-2'));

    const list = readStorageList<StoredRecord>(KEY);
    expect(list.map((item) => item.id)).toEqual(['demo-2', 'demo-1']);
  });
});

describe('removeStorageRecord', () => {
  it('按 id 删除单条记录', () => {
    prependStorageRecord(KEY, buildRecord('demo-1'));
    prependStorageRecord(KEY, buildRecord('demo-2'));

    removeStorageRecord(KEY, 'demo-1');

    const list = readStorageList<StoredRecord>(KEY);
    expect(list.map((item) => item.id)).toEqual(['demo-2']);
  });
});
