import {Request, Response, NextFunction} from "express";
import { ApiError, ErrorCodes, LogError } from "@/core/errors/index.ts";
import { errorResponse } from "@/common/utils/transformers/api-response.ts";
import { ErrorCodeType } from "@/common/types/response.ts";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorHandlerMiddleware = (err: unknown, _req: Request, res: Response, _next: NextFunction) => {

  if (err instanceof ApiError) {
    return res.status(err.statusCode).json(
      errorResponse(err)
    );
  }

  let responseErrorCode: ErrorCodeType = ErrorCodes.system.INTERNAL_SERVER_ERROR;

  if (err instanceof LogError) {
    console.error(`[${err.severity}] [${err.serviceName}]: ${err.message}`);
    if (err.context) console.error("   ↳ Contexto:", err.context);
    console.error("   ↳ Error Original:", err.originalError);

    if (err.errorCode) {
      responseErrorCode = err.errorCode;
    }

  } else {
    console.error("Critical error not handled:", err);
  }

  return res.status(500).json(
    errorResponse(new ApiError(
      "Error server",
      500,
      responseErrorCode,
    ))
  );
};