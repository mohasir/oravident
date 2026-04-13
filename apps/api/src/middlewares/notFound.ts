import {Request, Response, NextFunction} from "express";
import { ApiError, ErrorCodes } from "@/core/errors/index.ts";

export const notFoundMiddleware = (_req: Request, _res: Response, next: NextFunction) => {
  return next(new ApiError(
    'Route not found', 
    404, 
    ErrorCodes.system.ROUTE_NOT_FOUND
  ));
}