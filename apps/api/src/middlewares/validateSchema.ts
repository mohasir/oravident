import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { ApiError, ErrorCodes } from '@/core/errors/index.ts';

export const validateSchema = <T extends z.ZodTypeAny>(schema?: T) => {
  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      const details: Record<string, string[]> = {};

      // 1. Auto-validate params (non-empty strings and ID patterns)
      Object.keys(req.params).forEach((key) => {
        const value = req.params[key];

        // Base rule: Must be a non-empty string
        const baseResult = z
          .string()
          .min(1, `${key} is required`)
          .safeParse(value);
        if (!baseResult.success) {
          details[key] = baseResult.error.issues.map((e) => e.message);
          return;
        }

        // Specific rule: If it's an ID field, must be a UUID
        if (key.toLowerCase().endsWith('id') || key.toLowerCase() === 'id') {
          const uuidResult = z
            .string()
            .uuid(`Invalid format for ${key}`)
            .safeParse(value);
          if (!uuidResult.success) {
            details[key] = uuidResult.error.issues.map((e) => e.message);
          }
        }
      });

      // 2. Validate body if schema provided
      if (schema) {
        if (!req.body || Object.keys(req.body).length === 0) {
          throw new ApiError(
            'Request body is required',
            400,
            ErrorCodes.validation.VALIDATION_ERROR,
            { body: ['Request body cannot be empty'] },
          );
        }

        const bodyResult = await schema.safeParseAsync(req.body);

        if (!bodyResult.success) {
          bodyResult.error.issues.forEach((err) => {
            if (err.code === 'unrecognized_keys') {
              details['unrecognizedKeys'] = (err as { keys: string[] }).keys;
              return;
            }

            const path = err.path.join('.') || 'body';
            if (!details[path]) {
              details[path] = [];
            }
            details[path].push(err.message);
          });
        }
      }

      // If there are any errors (from params or body), throw
      if (Object.keys(details).length > 0) {
        throw new ApiError(
          'Validation failed',
          400,
          ErrorCodes.validation.VALIDATION_ERROR,
          details,
        );
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};
