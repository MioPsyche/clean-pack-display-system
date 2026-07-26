import { describe, expect, it } from 'vitest';
import { escapeCsvCell } from '../src/utils/csv';

describe('escapeCsvCell', () => {
  it('普通文本包裹双引号', () => {
    expect(escapeCsvCell('演示联系人')).toBe('"演示联系人"');
    expect(escapeCsvCell(42)).toBe('"42"');
  });

  it('undefined 输出空单元格', () => {
    expect(escapeCsvCell(undefined)).toBe('""');
  });

  it('内部双引号转义为两个双引号', () => {
    expect(escapeCsvCell('说"明"')).toBe('"说""明"""');
  });

  it('公式前缀（= + - @）追加单引号，防止表格软件执行公式', () => {
    expect(escapeCsvCell('=HYPERLINK("http://evil","点我")')).toBe(
      '"\'=HYPERLINK(""http://evil"",""点我"")"',
    );
    expect(escapeCsvCell('+cmd')).toBe('"\'+cmd"');
    expect(escapeCsvCell('-1+1')).toBe('"\'-1+1"');
    expect(escapeCsvCell('@import')).toBe('"\'@import"');
  });
});
