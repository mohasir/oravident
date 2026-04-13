import { ApiResponse, ApiResponseError } from "@/common/types/response.ts";

export const successResponse = <T>(data: T, meta?: ApiResponse<T>['meta']): ApiResponse<T> => {
  return { 
    success: true, 
    data, 
    meta 
  };
}

export const errorResponse = ({
  statusCode,
  errorCode, 
  message, 
  details
}: ApiResponseError): ApiResponse<never> => {
  return {
    success: false,
    errors: {
      statusCode,
      errorCode,
      message,
      details
    }
  }
}