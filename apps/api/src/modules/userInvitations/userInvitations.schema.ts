import { z } from 'zod';
import { DB_LIMITS } from '@/core/db/constants.ts';
import { emailSchema, createIdSchema } from '@/common/schemas/common.schema.ts';
import { TypedRequest } from '@/common/types/requests.ts';

// ==========================================
// 1. CORE DOMAIN SCHEMAS
// ==========================================

export const sendInvitationSchema = z
  .object({
    email: emailSchema,
    roleId: createIdSchema('Role'),
  })
  .strict();

export const acceptInvitationSchema = z
  .object({
    firstName: z.string().min(2).max(DB_LIMITS.NAME),
    lastName: z.string().min(2).max(DB_LIMITS.NAME),
    phone: z.string().min(7).max(DB_LIMITS.PHONE),
  })
  .strict();

export const validateTokenSchema = z.object({
  token: z.string().min(1, 'Token is required'),
});

export const userInvitationFiltersSchema = z
  .object({
    id: createIdSchema('id').optional(),
    email: z.string().optional(),
    token: z.string().optional(),
    isActive: z.boolean().optional(),
  })
  .strict();

// ==========================================
// 2. API REQUEST SCHEMAS
// ==========================================

export const sendInvitationRequestSchema = {
  body: sendInvitationSchema,
};

export const validateInvitationRequestSchema = {
  params: validateTokenSchema,
};

export const acceptInvitationRequestSchema = {
  params: validateTokenSchema,
  body: acceptInvitationSchema,
};

// ==========================================
// 3. DTOs & DOMAIN TYPES
// ==========================================

export type SendInvitationDTO = z.infer<typeof sendInvitationSchema>;
export type AcceptInvitationDTO = z.infer<typeof acceptInvitationSchema>;
export type UserInvitationFiltersDTO = z.infer<
  typeof userInvitationFiltersSchema
>;

// ==========================================
// 4. TYPED REQUESTS
// ==========================================

export type SendInvitationRequest = TypedRequest<
  typeof sendInvitationRequestSchema
>;
export type ValidateInvitationRequest = TypedRequest<
  typeof validateInvitationRequestSchema
>;
export type AcceptInvitationRequest = TypedRequest<
  typeof acceptInvitationRequestSchema
>;
