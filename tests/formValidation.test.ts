import { describe, expect, it } from 'vitest';
import { phoneNumber, required } from '../src/utils/formValidation';

describe('required', () => {
  it('空白字符串返回错误提示', () => {
    expect(required('   ', '请填写')).toBe('请填写');
  });

  it('有内容时返回 undefined', () => {
    expect(required('张同学', '请填写')).toBeUndefined();
  });
});

describe('phoneNumber', () => {
  it('接受常见手机号和座机格式', () => {
    expect(phoneNumber('13800000000')).toBeUndefined();
    expect(phoneNumber('+86 138 0000 0000')).toBeUndefined();
    expect(phoneNumber('0816-6089999')).toBeUndefined();
  });

  it('拒绝空值', () => {
    expect(phoneNumber('')).toBe('请填写联系电话');
    expect(phoneNumber('   ')).toBe('请填写联系电话');
  });

  it('拒绝纯符号（不含足够数字）', () => {
    expect(phoneNumber('------')).toBe('请填写有效联系电话');
    expect(phoneNumber('+-+-+-')).toBe('请填写有效联系电话');
  });

  it('拒绝非法字符和过短号码', () => {
    expect(phoneNumber('abc12345')).toBe('请填写有效联系电话');
    expect(phoneNumber('123')).toBe('请填写有效联系电话');
  });
});
