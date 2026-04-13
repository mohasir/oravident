import { ErrorCodeType, ApiResponseErrorDetails, ApiResponseError } from "@/common/types/response.ts";

export class ApiError extends Error implements ApiResponseError {
  statusCode: number;
  errorCode: ErrorCodeType;
  details?: ApiResponseErrorDetails;

  constructor(
    message: string, 
    statusCode: number, 
    errorCode: ErrorCodeType, 
    details?: ApiResponseErrorDetails
  ) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.details = details;

    Object.setPrototypeOf(this, ApiError.prototype);
  }
}