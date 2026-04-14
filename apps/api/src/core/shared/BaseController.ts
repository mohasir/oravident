import { Response } from 'express';
import { ApiError, ErrorCodes } from '@/core/errors/index.ts';
import { successResponse } from '@/common/utils/transformers/api-response.ts';
import { ApiResponseMeta, ErrorCodeType } from '@/common/types/response.ts';

export abstract class BaseController {
  
  // --- Success Responses ---

  public ok<T>(res: Response, data: T) {
    return res.status(200).json(successResponse(data));
  }

  public created<T>(res: Response, data: T) {
    return res.status(201).json(successResponse(data));
  }

  public noContent(res: Response) {
    return res.status(204).send();
  }

  public paginated<T>(res: Response, data: T[], meta: ApiResponseMeta) {
    return res.status(200).json(successResponse(data, meta));
  }

  // --- Semantic Error Helpers (Developer Friendly) ---

  public unauthorized(developerMessage = 'Unauthorized access', errorCode: ErrorCodeType = ErrorCodes.auth.UNAUTHORIZED) {
    throw new ApiError(developerMessage, 401, errorCode);
  }

  public forbidden(developerMessage = 'Forbidden access', errorCode: ErrorCodeType = ErrorCodes.auth.FORBIDDEN) {
    throw new ApiError(developerMessage, 403, errorCode);
  }

  public notFound(developerMessage = 'Resource not found', errorCode: ErrorCodeType = ErrorCodes.system.ROUTE_NOT_FOUND) {
    throw new ApiError(developerMessage, 404, errorCode);
  }

  public conflict(developerMessage = 'Conflict detected', errorCode: ErrorCodeType = ErrorCodes.system.CONFLICT) {
    throw new ApiError(developerMessage, 409, errorCode);
  }

  public tooMany(developerMessage = 'Too many requests', errorCode: ErrorCodeType = ErrorCodes.system.INTERNAL_SERVER_ERROR) {
    throw new ApiError(developerMessage, 429, errorCode);
  }
}
