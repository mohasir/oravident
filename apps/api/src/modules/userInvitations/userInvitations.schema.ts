import { z } from 'zod';
import { Request } from 'express';
import { DB_LIMITS } from '@/core/db/constants.ts';
import {
  confirmPasswordSchema,
  passwordMatchRefine,
} from '@modules/auth/auth.schema.ts';

export const sendInvitationSchema = z
  .object({
    email: z
      .email({
        error: (issue) =>
          issue.code === 'invalid_type'
            ? 'Email is required'
            : 'Invalid email format',
      })
      .max(DB_LIMITS.EMAIL),
    roleId: z.uuid({
      error: (issue) =>
        issue.code === 'invalid_type'
          ? 'Role ID is required'
          : 'Invalid Role ID format',
    }),
  })
  .strict();

export const validateTokenSchema = z.object({
  token: z.string().min(1, 'Token is required'),
});

export const acceptInvitationSchema = confirmPasswordSchema
  .extend({
    token: z.string(),
    firstName: z.string().min(2).max(DB_LIMITS.NAME),
    lastName: z.string().min(2).max(DB_LIMITS.NAME),
    phone: z.string().min(7).max(DB_LIMITS.PHONE),
  })
  .superRefine(passwordMatchRefine);

export type SendInvitationDTO = z.infer<typeof sendInvitationSchema>;
export type AcceptInvitationDTO = z.infer<typeof acceptInvitationSchema>;

export type UserInvitationFilters = {
  id?: string;
  email?: string;
  token?: string;
  isActive?: boolean;
};

export interface TokenParamRequest extends Request {
  params: {
    token: string;
  };
}

export interface AcceptInvitationRequest extends Request {
  params: {
    token: string;
  };
  body: AcceptInvitationDTO;
}
