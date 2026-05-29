import { z } from 'zod';
import { DB_LIMITS } from '../constants.ts';

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(
    DB_LIMITS.PASSWORD,
    `Password cannot exceed ${DB_LIMITS.PASSWORD} characters`,
  )
  .regex(/[a-z]/, 'Must contain at least one lowercase letter')
  .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
  .regex(/[0-9]/, 'Must contain at least one number')
  .regex(/[^a-zA-Z0-9]/, 'Must contain at least one special character');

export const emailSchema = z
  .email({
    error: (issue) =>
      issue.code === 'invalid_type'
        ? 'Email is required'
        : 'Invalid email format',
  })
  .max(DB_LIMITS.EMAIL, `Email cannot exceed ${DB_LIMITS.EMAIL} characters`);

export const createIdParamSchema = (key: string) => {
  return z.uuid(`Invalid format for parameter ${key}`);
};

export const createIdSchema = (fieldName: string) => {
  return z.uuid({
    error: (issue) =>
      issue.code === 'invalid_type'
        ? `${fieldName} ID is required`
        : `Invalid ${fieldName} ID format`,
  });
};

export const paginationQuerySchema = z.object({
  page: z.coerce.number().min(1, 'Page must be at least 1').optional(),
  limit: z.coerce
    .number()
    .min(1, 'Limit must be at least 1')
    .max(100, 'Limit cannot exceed 100')
    .optional(),
});
