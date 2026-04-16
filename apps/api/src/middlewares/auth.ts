import { ApiError, ErrorCodes } from "@/core/errors/index.ts";
import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "@/common/utils/jwt.ts";
import { userRepository } from "@/bootstrap/container.ts";

export const authMiddleware = async (
  req: Request, res: Response, next: NextFunction
) => {
  try{

    const authHeader =  req.headers.authorization;

    const token = authHeader?.split(' ')[1];

    if(!token){
      throw new ApiError('No token provider', 401, ErrorCodes.auth.UNAUTHORIZED);
    }
    const payload = verifyAccessToken(token);

    const user = await userRepository.findActiveUserWorkerById(payload.id);

    if (!user) {
      throw new ApiError('User inactive or not found', 401, ErrorCodes.auth.UNAUTHORIZED);
    }

    req.user = {
      token: payload,
      clinicId: user.worker?.clinicId || undefined
    }

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