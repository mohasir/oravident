import { Request, Response, NextFunction } from 'express';
import { z, ZodError } from 'zod';
import { ApiError, ErrorCodes } from '@/core/errors/index.ts';

export const validateSchema = <T extends z.ZodTypeAny>(schema: T) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.body || Object.keys(req.body).length === 0) {
        throw new ApiError(
          "Request body is required", 
          400, 
          ErrorCodes.validation.VALIDATION_ERROR,
          { body: ["Request body cannot be empty"] }
        );
      }

      await schema.parseAsync(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const details: Record<string, string[]> = {};
        
        error.issues.forEach(err => {
          const path = err.path.join('.') || 'body';
          
          if (!details[path]) {
            details[path] = [];
          }
          details[path].push(err.message);
        });

        return next(new ApiError(
          "Validation failed", 
          400, 
          ErrorCodes.validation.VALIDATION_ERROR, 
          details
        ));
      }
      next(error);
    }
  };
};
