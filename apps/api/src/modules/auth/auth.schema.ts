import { DB_LIMITS } from '@/core/db/constants.ts';
import { ContractTypes, Genders } from '@/core/db/enums.ts';
import { z } from 'zod';


export const passwordSchema = z.string()
.min(8, "Password must be at least 8 characters")
.max(100)
.regex(/[a-z]/, "Must contain at least one lowercase letter")
.regex(/[A-Z]/, "Must contain at least one uppercase letter")
.regex(/[0-9]/, "Must contain at least one number")
.regex(/[^a-zA-Z0-9]/, "Must contain at least one special character");

export const confirmPasswordSchema = z.object({
  password: passwordSchema,
  confirmPassword: passwordSchema
});
type confirmPasswordType = z.infer<typeof confirmPasswordSchema>;

export const passwordMatchRefine = (data: confirmPasswordType, ctx: z.RefinementCtx) => {
  if (data.confirmPassword !== data.password) {
    ctx.addIssue({
      code: "custom",
      message: "Passwords don't match",
      path: ['confirmPassword'],
    });
  }
};

export const loginSchema = z.object({
  email: z.email("Invalid email format"),
  password: z.string()
    .nonempty("Password is required")
    .max(DB_LIMITS.PASSWORD),
}).strict();

export const sessionMetaSchema = z.object({
  userAgent: z.string().optional().nullable(),
  ipAddress: z.string().optional().nullable(),
});

export const userSessionSchema = sessionMetaSchema.extend({
  userId: z.string(),
  token: z.string(),
  expiresAt: z.date(),
});

export const inviteWorkerSchema = z.object({
  email: z.email("Invalid email format").max(DB_LIMITS.EMAIL),
  roleId: z.uuid("Invalid Role ID format"),
}).strict();

export const acceptInvitationSchema = confirmPasswordSchema.extend({
  token: z.string(),
  firstName: z.string().min(2).max(DB_LIMITS.NAME),
  lastName: z.string().min(2).max(DB_LIMITS.NAME),
  phone: z.string().min(7).max(DB_LIMITS.PHONE),
}).superRefine(passwordMatchRefine);

export const registerSchema = confirmPasswordSchema.extend({
  // User Account Info
  email: z.string({ error: "Email is required" }).email("Invalid email format").max(DB_LIMITS.EMAIL),

  // Worker Profile Info
  roleId: z.string({ error: "Role ID is required" }).uuid("Invalid Role ID format"),
  firstName: z.string({ error: "First name is required" }).min(2, "First name must be at least 2 characters").max(DB_LIMITS.NAME),
  secondName: z.string().max(DB_LIMITS.NAME).optional().nullable(),
  lastName: z.string({ error: "Last name is required" }).min(2, "Last name must be at least 2 characters").max(DB_LIMITS.NAME),
  secondLastName: z.string().max(DB_LIMITS.NAME).optional().nullable(),
  phone: z.string({ error: "Phone is required" }).min(7, "Phone must be at least 7 characters").max(DB_LIMITS.PHONE),
  idNumber: z.string().max(DB_LIMITS.ID_NUMBER).optional().nullable(),
  licenseNumber: z.string().max(DB_LIMITS.SHORT_NAME).optional().nullable(),
  dateOfBirth: z.string().optional().nullable(),
  gender: z.enum(Genders, { errorMap: () => ({ message: "Invalid gender selection" }) }),
  prefix: z.string().max(20).optional().nullable(),
  specialty: z.string().max(DB_LIMITS.NAME).optional().nullable(),
  calendarColor: z.string().regex(/^#[0-9A-F]{6}$/i, "Invalid color format").optional(),
  contractType: z.enum(ContractTypes, { error_map: () => ({ message: "Invalid contract type" }) }).optional(),
}).strict().superRefine(passwordMatchRefine);

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
  calendarColor: z.string().regex(/^#[0-9A-F]{6}$/i).optional(),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email format"),
});

export const resetPasswordSchema = confirmPasswordSchema.extend({}).superRefine(passwordMatchRefine);

export const changePasswordSchema = confirmPasswordSchema.extend({
  currentPassword: z.string().min(1).max(100),
}).superRefine(passwordMatchRefine);

// --- DTO Types ---
export type LoginDTO = z.infer<typeof loginSchema>;
export type UserSessionsDTO = z.infer<typeof userSessionSchema>;
export type SessionMetaDTO = z.infer<typeof sessionMetaSchema>;
export type InviteWorkerDTO = z.infer<typeof inviteWorkerSchema>;
export type AcceptInvitationDTO = z.infer<typeof acceptInvitationSchema>;
export type RegisterDTO = z.infer<typeof registerSchema>;
export type UpdateProfileDTO = z.infer<typeof updateProfileSchema>;
export type ForgotPasswordDTO = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordDTO = z.infer<typeof resetPasswordSchema>;
export type ChangePasswordDTO = z.infer<typeof changePasswordSchema>;