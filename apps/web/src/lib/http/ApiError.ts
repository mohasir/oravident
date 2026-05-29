import axios from 'axios';
import type { ApiErrorResponse } from './types';

export class ApiError extends Error {
  readonly errorCode?: string;
  readonly statusCode?: number;
  readonly details?: Record<string, string[]>;

  constructor(
    message: string,
    opts?: {
      errorCode?: string;
      statusCode?: number;
      details?: Record<string, string[]>;
    },
  ) {
    super(message);
    this.name = this.constructor.name;
    this.errorCode = opts?.errorCode;
    this.statusCode = opts?.statusCode;
    this.details = opts?.details;
  }

  static from(error: unknown): ApiError {
    if (axios.isAxiosError<ApiErrorResponse>(error)) {
      const apiError = error.response?.data?.errors;
      return new ApiError(error.response?.data?.message ?? error.message, {
        errorCode: apiError?.errorCode,
        statusCode: apiError?.statusCode,
        details: apiError?.details,
      });
    }
    if (error instanceof Error) {
      return new ApiError(error.message);
    }
    return new ApiError('Unknown error');
  }
}
