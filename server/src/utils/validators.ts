import { HttpError } from "./httpError.js";

export type RequestBody = Record<string, unknown>;

export interface StringFieldOptions {
  label?: string;
  maxLength?: number;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const asObject = (value: unknown): RequestBody => {
  if (value !== null && typeof value === "object" && !Array.isArray(value)) {
    return value as RequestBody;
  }

  throw new HttpError(400, "请求体必须是 JSON 对象。");
};

export const readRequiredString = (body: RequestBody, field: string, options: StringFieldOptions = {}): string => {
  const label = options.label ?? field;
  const value = body[field];

  if (typeof value !== "string" || value.trim().length === 0) {
    throw new HttpError(400, `${label}不能为空。`);
  }

  const normalized = value.trim();

  if (options.maxLength !== undefined && normalized.length > options.maxLength) {
    throw new HttpError(400, `${label}长度不能超过 ${options.maxLength} 个字符。`);
  }

  return normalized;
};

export const readOptionalString = (
  body: RequestBody,
  field: string,
  options: StringFieldOptions = {}
): string | undefined => {
  const label = options.label ?? field;
  const value = body[field];

  if (value === undefined || value === null) {
    return undefined;
  }

  if (typeof value !== "string") {
    throw new HttpError(400, `${label}必须是字符串。`);
  }

  const normalized = value.trim();

  if (options.maxLength !== undefined && normalized.length > options.maxLength) {
    throw new HttpError(400, `${label}长度不能超过 ${options.maxLength} 个字符。`);
  }

  return normalized.length > 0 ? normalized : undefined;
};

export const readOptionalEmail = (
  body: RequestBody,
  field: string,
  options: StringFieldOptions = {}
): string | undefined => {
  const label = options.label ?? field;
  const value = readOptionalString(body, field, options);

  if (value !== undefined && !EMAIL_PATTERN.test(value)) {
    throw new HttpError(400, `${label}格式不正确。`);
  }

  return value;
};

export const parseId = (value: string | undefined, label = "id"): number => {
  if (typeof value !== "string" || !/^\d+$/.test(value.trim())) {
    throw new HttpError(400, `${label}必须是正整数。`);
  }

  const parsed = Number(value.trim());

  if (!Number.isSafeInteger(parsed) || parsed <= 0) {
    throw new HttpError(400, `${label}必须是正整数。`);
  }

  return parsed;
};
