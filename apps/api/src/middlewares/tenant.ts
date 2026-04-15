import { ApiError } from '@/core/errors/ApiError.ts';
import { ErrorCodes } from '@/core/errors/ErrorCodes.ts';
import { Request, Response, NextFunction } from 'express';
import { clinicService } from '@/bootstrap/container.ts';

export const tenantMiddleware = async (
  req: Request, res: Response, next: NextFunction
) => {
  try {

    const tenantId = req.tenant?.id;

    if (!tenantId) {
      throw new ApiError('No tenant provided', 401, ErrorCodes.auth.UNAUTHORIZED);
    }

    await clinicService.validateTenant(tenantId);

    next();

  } catch (error) {
    next(error);
  }
}
