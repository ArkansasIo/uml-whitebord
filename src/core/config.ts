import { err, ok, type Result } from "./result.js";

export interface AppConfig {
  readonly appName: string;
  readonly environment: "development" | "test" | "production";
  readonly port: number;
  readonly logLevel: "debug" | "info" | "warn" | "error";
}

export function loadConfig(
  input: Readonly<Record<string, string | undefined>>,
): Result<AppConfig> {
  const appName = input.APP_NAME?.trim() || "application";
  const environment = input.NODE_ENV ?? "development";
  const rawPort = input.PORT ?? "3000";
  const logLevel = input.LOG_LEVEL ?? "info";
  const port = Number(rawPort);

  if (!["development", "test", "production"].includes(environment)) {
    return err({ code: "VALIDATION_ERROR", message: "NODE_ENV is invalid." });
  }
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    return err({ code: "VALIDATION_ERROR", message: "PORT must be an integer from 1 to 65535." });
  }
  if (!["debug", "info", "warn", "error"].includes(logLevel)) {
    return err({ code: "VALIDATION_ERROR", message: "LOG_LEVEL is invalid." });
  }

  return ok({
    appName,
    environment: environment as AppConfig["environment"],
    port,
    logLevel: logLevel as AppConfig["logLevel"],
  });
}
