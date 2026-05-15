import { HttpError } from "./httpError.js";

export type RequestBody = Record<string, unknown>;

export const asObject = (value: unknown): RequestBody => {
  if (value !== null && typeof value === "object" && !Array.isArray(value)) {
    return value as RequestBody;
  }

  throw new HttpError(400, "Request body must be an object.");
};

export const readRequiredString = (body: RequestBody, field: string): string => {
  const value = body[field];

  if (typeof value !== "string" || value.trim().length === 0) {
    throw new HttpError(400, `${field} is required.`);
  }

  return value.trim();
};

export const readOptionalString = (body: RequestBody, field: string): string | undefined => {
  const value = body[field];

  if (value === undefined || value === null) {
    return undefined;
  }

  if (typeof value !== "string") {
    throw new HttpError(400, `${field} must be a string.`);
  }

  const normalized = value.trim();
  return normalized.length > 0 ? normalized : undefined;
};

export const readOptionalStringFrom = (body: RequestBody, fields: string[]): string | undefined => {
  for (const field of fields) {
    const value = readOptionalString(body, field);
    if (value !== undefined) {
      return value;
    }
  }

  return undefined;
};

export const parseId = (value: string | undefined, field = "id"): number => {
  const parsed = Number(value);

  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new HttpError(400, `${field} must be a positive integer.`);
  }

  return parsed;
};
