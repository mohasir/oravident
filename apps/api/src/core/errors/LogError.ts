import { ErrorCodeType } from "@/common/types/response.ts";

export type LogSeverity = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export class LogError extends Error {
  constructor(
    message: string,
    public severity: LogSeverity,
    public serviceName: string,
    public errorCode?: ErrorCodeType,
    public context?: Record<string, unknown> | unknown,
    public originalError?: unknown
  ) {
    super(message);
    this.name = this.constructor.name;
    Object.setPrototypeOf(this, LogError.prototype);
  }
}
