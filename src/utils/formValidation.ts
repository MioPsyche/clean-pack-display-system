export type FieldErrors<T extends string> = Partial<Record<T, string>>;

export function required(value: string, message = '此项为必填项') {
  return value.trim() ? undefined : message;
}

export function phoneNumber(value: string) {
  const normalized = value.trim();

  if (!normalized) {
    return '请填写联系电话';
  }

  // 允许数字、+、-、空格，但至少要包含 6 位数字，避免 “------” 这类纯符号通过
  const digitCount = normalized.replace(/\D/g, '').length;
  const hasValidCharset = /^[0-9+\-\s]{6,20}$/.test(normalized);

  return hasValidCharset && digitCount >= 6 ? undefined : '请填写有效联系电话';
}
