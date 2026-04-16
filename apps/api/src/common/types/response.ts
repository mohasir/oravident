import { ErrorCodes } from "@/core/errors/ErrorCodes.ts";

type DeepValueOf<T> = T extends Record<string, unknown> ? { 
  [K in keyof T]: DeepValueOf<T[K]> 
}[keyof T] : T;

export type ErrorCodeType = DeepValueOf<typeof ErrorCodes>;
export type ApiResponseErrorDetails = Record<string, string[]>;

export interface ApiResponseError {
  statusCode: number;
  errorCode: ErrorCodeType;
  details?: ApiResponseErrorDetails;
}

export type ApiResponseMeta = Record<string, unknown>;

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  errors?: ApiResponseError;
  meta?: ApiResponseMeta;
}