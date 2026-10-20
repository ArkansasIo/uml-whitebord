import { err, ok, type Result } from "./result.js";

export function requireNonEmptyString(
  value: unknown,
  fieldName: string,
  maxLength = 200,
): Result<string> {
  if (typeof value !== "string") {
    return err({ code: "VALIDATION_ERROR", message: `${fieldName} must be a string.` });
  }
  const normalized = value.trim();
  if (normalized.length === 0 || normalized.length > maxLength) {
    return err({
      code: "VALIDATION_ERROR",
      message: `${fieldName} must contain 1 to ${maxLength} characters.`,
    });
  }
  return ok(normalized);
}

export function requirePlainObject(value: unknown): Result<Record<string, unknown>> {
  if (value === null || typeof value !== "object" || Array.isArray(value)) {
    return err({ code: "VALIDATION_ERROR", message: "Expected an object." });
  }
  const prototype = Object.getPrototypeOf(value);
  if (prototype !== Object.prototype && prototype !== null) {
    return err({ code: "VALIDATION_ERROR", message: "Expected a plain object." });
  }
  return ok(value as Record<string, unknown>);
}
