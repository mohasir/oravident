import { ApiError } from '@/core/errors/ApiError.ts';
import { ErrorCodes } from '@/core/errors/ErrorCodes.ts';
import { Request, Response, NextFunction } from 'express';
import { clinicService } from '@/bootstrap/container.ts';
import { isSuperAdmin } from '@repo/guards';

export const tenantMiddleware = async (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  try {
    const user = req.user;

    if (user && isSuperAdmin(user.token.role)) {
      req.tenantId = null;
      return next();
    }

    const tokenTenantId = user?.token.tenantId;
    const workerClinicId = user?.clinicId;

    if (!tokenTenantId) {
      throw new ApiError('No tenant provided', 403, ErrorCodes.auth.FORBIDDEN);
    }

    if (tokenTenantId !== workerClinicId) {
      throw new ApiError(
        'Tenant mismatch. Your session is not valid for this clinic.',
        403,
        ErrorCodes.auth.FORBIDDEN,
      );
    }

    await clinicService.validateTenant(tokenTenantId);

    req.tenantId = tokenTenantId;
    next();
  } catch (error) {
    next(error);
  }
};
