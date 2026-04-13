import { ApiError, ErrorCodes } from "@/core/errors/index.ts";
import { errorResponse } from "@/common/utils/transformers/api-response.ts";
import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { ENV } from "@/core/config/env.ts";

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try{

    const authHeader =  req.headers.authorization;

    const token = authHeader?.split(' ')[1];

    if(!token){
      throw new ApiError('No token provider', 401, ErrorCodes.auth.UNAUTHORIZED);
    }

    const payload = jwt.verify(token, ENV.JWT_SECRET) as JwtPayload;

    const user = await userService.findById(payload.userId);
    const tenant = await tenantService.findById(payload.tenantId);

    req.user = user;
    req.tenant = tenant;

    next();

  } catch (error: unknown) {

    if (error instanceof ApiError) {
       return next(error);
    }

    if(error instanceof Error){
      if (error.name === 'TokenExpiredError' || error.name === 'JsonWebTokenError') {
        return next(new ApiError(
          error.message || 'Token expired or invalid',
          401, 
          ErrorCodes.auth.INVALID_TOKEN
        ));
      }
    }

    return next(error);
  }

}