import { Request, Response, NextFunction } from 'express';
import { ApiError } from '@core/errors/ApiError.ts';
import { ErrorCodes } from '@/core/errors/ErrorCodes.ts';
import { isSuperAdmin, PermissionType } from '@repo/guards';

export const guardMiddleware =
  (requiredPermissions: PermissionType[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user?.token;

      if (!user) {
        throw new ApiError(
          'Authentication required',
          401,
          ErrorCodes.auth.UNAUTHORIZED,
        );
      }

      if (isSuperAdmin(user.role)) {
        return next();
      }

      const userPermissions = req.user?.token.permissions || [];

      const hasAllPermissions = requiredPermissions.every((permission) =>
        userPermissions.includes(permission),
      );

      if (!hasAllPermissions) {
        throw new ApiError(
          'You do not have the necessary permissions for this action',
          403,
          ErrorCodes.auth.FORBIDDEN,
        );
      }

      next();
    } catch (error) {
      next(error);
    }
  };
