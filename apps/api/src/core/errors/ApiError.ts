import { ErrorCodeType, ApiResponseErrorDetails, ApiResponseError } from "@/common/types/response.ts";

export interface ApiErrorOptions {
  details?: ApiResponseErrorDetails;
  originalError?: unknown;
}

export class ApiError extends Error implements ApiResponseError {
  statusCode: number;
  errorCode: ErrorCodeType;
  details?: ApiResponseErrorDetails;
  originalError?: unknown;

  constructor(
    message: string,
    statusCode: number,
    errorCode: ErrorCodeType,
    options: ApiErrorOptions = {},
  ) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.details = options.details;
    this.originalError = options.originalError;

    Object.setPrototypeOf(this, ApiError.prototype);
  }
}