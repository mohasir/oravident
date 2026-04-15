import { ApiError } from '@/core/errors/ApiError.ts';
import { ErrorCodes } from '@/core/errors/ErrorCodes.ts';
import { Request, Response, NextFunction } from 'express';
import { clinicsService } from '@/modules/clinics/clinics.service.ts';

export const tenantMiddleware = async (
  req: Request, res: Response, next: NextFunction
) => {
  try {

    const tenantId = req.tenant?.id;

    if (!tenantId) {
      throw new ApiError('No tenant provided', 401, ErrorCodes.auth.UNAUTHORIZED);
    }

    await clinicsService.validateTenant(tenantId);

    next();

  } catch (error) {
    next(error);
  }
}
