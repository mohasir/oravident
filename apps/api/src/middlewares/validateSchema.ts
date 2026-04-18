import { Response, NextFunction } from 'express';
import { z } from 'zod';
import { ApiError, ErrorCodes } from '@/core/errors/index.ts';
import { createIdParamSchema } from '@/common/schemas/common.schema.ts';
import {
  RequestValidationSchema,
  TypedRequest,
  InferParams,
  InferQuery,
  InferBody,
} from '@/common/types/requests.ts';

export const validateSchema = <T extends RequestValidationSchema>(
  schemas?: T,
) => {
  return async (req: TypedRequest<T>, _res: Response, next: NextFunction) => {
    try {
      const details: Record<string, string[]> = {};
      let rawError: unknown = null;

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
          const uuidResult = createIdParamSchema(key).safeParse(value);

          if (!uuidResult.success) {
            details[key] = uuidResult.error.issues.map((e) => e.message);
          }
        }
      });

      // 1.1 Explicit params validation
      if (schemas?.params) {
        const paramsResult = schemas.params.safeParse(req.params);
        if (!paramsResult.success) {
          paramsResult.error.issues.forEach((err) => {
            const path = err.path.join('.') || 'params';
            details[path] = [...(details[path] || []), err.message];
          });
          rawError = paramsResult.error;
        } else {
          req.validatedParams = paramsResult.data as InferParams<T>;
        }
      }

      // 2. Validate query
      if (schemas?.query) {
        const queryResult = schemas.query.safeParse(req.query);
        if (!queryResult.success) {
          queryResult.error.issues.forEach((err) => {
            if (err.code === 'unrecognized_keys') {
              details['unrecognizedQueryKeys'] = (
                err as { keys: string[] }
              ).keys;
              return;
            }
            const path = err.path.join('.') || 'query';
            details[path] = [...(details[path] || []), err.message];
          });
          rawError = queryResult.error;
        } else {
          req.validatedQuery = queryResult.data as InferQuery<T>;
        }
      }

      // 3. Validate body
      if (schemas?.body) {
        if (!req.body || Object.keys(req.body).length === 0) {
          details['body'] = ['Request body is required'];
        } else {
          const bodyResult = await schemas.body.safeParseAsync(req.body);

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
            rawError = bodyResult.error;
          } else {
            req.validatedBody = bodyResult.data as InferBody<T>;
          }
        }
      }

      // If there are any errors (from params or body), throw
      if (Object.keys(details).length > 0) {
        throw new ApiError(
          'Validation failed',
          400,
          ErrorCodes.validation.VALIDATION_ERROR,
          { details, originalError: rawError },
        );
      }

      next();
    } catch (error) {
      if (!(error instanceof ApiError)) {
        return next(
          new ApiError(
            'Internal validation error',
            500,
            ErrorCodes.system.INTERNAL_SERVER_ERROR,
            { originalError: error },
          ),
        );
      }
      next(error);
    }
  };
};
