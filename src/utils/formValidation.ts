export type FieldErrors<T extends string> = Partial<Record<T, string>>;

export function required(value: string, message = '此项为必填项') {
  return value.trim() ? undefined : message;
}

export function phoneNumber(value: string) {
  if (!value.trim()) {
    return '请填写联系电话';
  }

  return /^[0-9+\-\s]{6,20}$/.test(value.trim())
    ? undefined
    : '请填写有效联系电话';
}
