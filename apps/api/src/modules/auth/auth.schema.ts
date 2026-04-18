import { z } from 'zod';
import { DB_LIMITS } from '@/core/db/constants.ts';
import { ContractTypes, Genders } from '@/core/db/enums.ts';
import {
  emailSchema,
  passwordSchema,
  createIdSchema,
} from '@/common/schemas/common.schema.ts';
import { TypedRequest } from '@/common/types/requests.ts';

// ==========================================
// 1. CORE DOMAIN SCHEMAS
// ==========================================

export const confirmPasswordSchema = z.object({
  password: passwordSchema,
  confirmPassword: passwordSchema,
});

type confirmPasswordType = z.infer<typeof confirmPasswordSchema>;

export const passwordMatchRefine = (
  data: confirmPasswordType,
  ctx: z.RefinementCtx,
) => {
  if (data.confirmPassword !== data.password) {
    ctx.addIssue({
      code: 'custom',
      message: "Passwords don't match",
      path: ['confirmPassword'],
    });
  }
};

export const loginSchema = z
  .object({
    email: emailSchema,
    password: z
      .string({ error: 'Password is required' })
      .min(1, 'Password is required')
      .max(DB_LIMITS.PASSWORD),
  })
  .strict();

export const sessionMetaSchema = z.object({
  userAgent: z.string().optional().nullable(),
  ipAddress: z.string().optional().nullable(),
});

export const userSessionSchema = sessionMetaSchema.extend({
  userId: z.string(),
  token: z.string(),
  expiresAt: z.date(),
});

export const registerSchema = confirmPasswordSchema
  .extend({
    // User Account Info
    email: emailSchema,

    // Worker Profile Info
    roleId: createIdSchema('Role'),
    firstName: z
      .string({ error: 'First name is required' })
      .min(2, 'First name must be at least 2 characters')
      .max(DB_LIMITS.NAME),
    secondName: z.string().max(DB_LIMITS.NAME).optional().nullable(),
    lastName: z
      .string({ error: 'Last name is required' })
      .min(2, 'Last name must be at least 2 characters')
      .max(DB_LIMITS.NAME),
    secondLastName: z.string().max(DB_LIMITS.NAME).optional().nullable(),
    phone: z
      .string({ error: 'Phone is required' })
      .min(7, 'Phone must be at least 7 characters')
      .max(DB_LIMITS.PHONE),
    idNumber: z.string().max(DB_LIMITS.ID_NUMBER).optional().nullable(),
    licenseNumber: z.string().max(DB_LIMITS.SHORT_NAME).optional().nullable(),
    dateOfBirth: z.string().optional().nullable(),
    gender: z.enum(Genders, { error: 'Invalid gender selection' }),
    prefix: z.string().max(20).optional().nullable(),
    specialty: z.string().max(DB_LIMITS.NAME).optional().nullable(),
    calendarColor: z
      .string()
      .regex(/^#[0-9A-F]{6}$/i, 'Invalid color format')
      .optional(),
    contractType: z
      .enum(ContractTypes, { error: 'Invalid contract type' })
      .optional(),
  })
  .strict()
  .superRefine(passwordMatchRefine);

export const updateProfileSchema = z.object({
  firstName: z.string().min(2).max(DB_LIMITS.NAME).optional(),
  secondName: z.string().max(DB_LIMITS.NAME).optional().nullable(),
  lastName: z.string().min(2).max(DB_LIMITS.NAME).optional(),
  secondLastName: z.string().max(DB_LIMITS.NAME).optional().nullable(),
  phone: z.string().min(7).max(DB_LIMITS.PHONE).optional(),
  idNumber: z.string().max(DB_LIMITS.ID_NUMBER).optional().nullable(),
  licenseNumber: z.string().max(DB_LIMITS.SHORT_NAME).optional().nullable(),
  prefix: z.string().max(20).optional().nullable(),
  specialty: z.string().max(DB_LIMITS.NAME).optional().nullable(),
  calendarColor: z
    .string()
    .regex(/^#[0-9A-F]{6}$/i)
    .optional(),
});

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export const resetPasswordSchema = confirmPasswordSchema
  .extend({
    token: z.string(),
  })
  .superRefine(passwordMatchRefine);

export const changePasswordSchema = confirmPasswordSchema
  .extend({
    currentPassword: z.string().min(1).max(100),
  })
  .superRefine(passwordMatchRefine);

export const userSessionFiltersSchema = z
  .object({
    id: createIdSchema('id').optional(),
    userId: createIdSchema('User').optional(),
    token: z.string().optional(),
    isValid: z.boolean().optional(),
  })
  .strict();

export const userPasswordResetFiltersSchema = z
  .object({
    id: createIdSchema('id').optional(),
    userId: createIdSchema('User').optional(),
    token: z.string().optional(),
    usedAt: z.date().optional().nullable(),
    isValid: z.boolean().optional(),
  })
  .strict();

// ==========================================
// 2. API REQUEST SCHEMAS
// ==========================================

export const loginRequestSchema = {
  body: loginSchema,
};

export const registerRequestSchema = {
  body: registerSchema,
};

export const forgotPasswordRequestSchema = {
  body: forgotPasswordSchema,
};

export const resetPasswordRequestSchema = {
  body: resetPasswordSchema,
};

export const changePasswordRequestSchema = {
  body: changePasswordSchema,
};

export const updateProfileRequestSchema = {
  body: updateProfileSchema,
};

// ==========================================
// 3. DTOs & DOMAIN TYPES
// ==========================================

export type LoginDTO = z.infer<typeof loginSchema>;
export type UserSessionsDTO = z.infer<typeof userSessionSchema>;
export type SessionMetaDTO = z.infer<typeof sessionMetaSchema>;
export type RegisterDTO = z.infer<typeof registerSchema>;
export type UpdateProfileDTO = z.infer<typeof updateProfileSchema>;
export type ForgotPasswordDTO = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordDTO = z.infer<typeof resetPasswordSchema>;
export type ChangePasswordDTO = z.infer<typeof changePasswordSchema>;
export type UserSessionFiltersDTO = z.infer<typeof userSessionFiltersSchema>;
export type UserPasswordResetFiltersDTO = z.infer<
  typeof userPasswordResetFiltersSchema
>;

// ==========================================
// 4. TYPED REQUESTS
// ==========================================

export type LoginRequest = TypedRequest<typeof loginRequestSchema>;
export type RegisterRequest = TypedRequest<typeof registerRequestSchema>;
export type ForgotPasswordRequest = TypedRequest<
  typeof forgotPasswordRequestSchema
>;
export type ResetPasswordRequest = TypedRequest<
  typeof resetPasswordRequestSchema
>;
export type ChangePasswordRequest = TypedRequest<
  typeof changePasswordRequestSchema
>;
export type UpdateProfileRequest = TypedRequest<
  typeof updateProfileRequestSchema
>;
