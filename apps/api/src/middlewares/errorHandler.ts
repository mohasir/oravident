import { Request, Response, NextFunction } from 'express';
import { ApiError, ErrorCodes, LogError } from '@/core/errors/index.ts';
import { errorResponse } from '@/common/utils/transformers/api-response.ts';
import { ErrorCodeType } from '@/common/types/response.ts';

/* eslint-disable @typescript-eslint/no-unused-vars */
export const errorHandlerMiddleware = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  if (err instanceof ApiError) {
    if (err.originalError || err.statusCode >= 500) {
      console.error(' [ApiError Handler]:', err.message);
      if (err.originalError) console.error('   ↳ [Original Error]:', err.originalError);
    }

    return res.status(err.statusCode).json(errorResponse(err.message, err));
  }

  let responseErrorCode: ErrorCodeType =
    ErrorCodes.system.INTERNAL_SERVER_ERROR;

  // Handle JSON SyntaxError (usually from express.json())
  if (
    err instanceof SyntaxError &&
    'status' in err &&
    err.status === 400 &&
    'body' in err
  ) {
    console.error('   ↳ [JSON Syntax Error]:', err);

    const syntaxError = new ApiError(
      'Invalid JSON syntax',
      400,
      ErrorCodes.validation.VALIDATION_ERROR,
      { originalError: err },
    );
    return res
      .status(400)
      .json(errorResponse(syntaxError.message, syntaxError));
  }

  if (err instanceof LogError) {
    console.error(`[${err.severity}] [${err.serviceName}]: ${err.message}`);
    if (err.context) console.error('   ↳ Contexto:', err.context);
    console.error('   ↳ Error Original:', err.originalError);

    if (err.errorCode) {
      responseErrorCode = err.errorCode;
    }
  } else {
    console.error('Critical error not handled:', err);
    if (err instanceof Error) {
      console.error('   ↳ [Stack Trace]:', err.stack);
    }
  }

  const fallbackError = new ApiError(
    'Internal server error',
    500,
    responseErrorCode,
  );
  return res
    .status(500)
    .json(errorResponse(fallbackError.message, fallbackError));
};
