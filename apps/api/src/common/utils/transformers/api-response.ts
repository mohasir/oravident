import {
  ApiResponse,
  ApiResponseError,
  ApiResponseMeta,
} from '@/common/types/response.ts';

export const successResponse = <T>(
  message: string,
  data?: T,
  meta?: ApiResponseMeta,
): ApiResponse<T> => {
  return {
    success: true,
    message,
    ...(data != null && { data }),
    ...(meta != null && { meta }),
  };
};

export const successPaginatedResponse = <T>(
  message: string,
  data?: T,
  meta?: ApiResponseMeta,
): ApiResponse<T> => {
  return {
    success: true,
    message,
    ...(data != null && { data }),
    ...(meta != null && { meta }),
  };
};

export const errorResponse = (
  message: string,
  { statusCode, errorCode, details }: ApiResponseError,
): ApiResponse<never> => {
  return {
    success: false,
    message,
    errors: {
      statusCode,
      errorCode,
      details,
    },
  };
};
