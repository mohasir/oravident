import * as z from 'zod';

export const resetPasswordSchema = z
  .object({
    password: z.string().min(8, { message: 'auth.resetPassword.validation.minPassword' }),
    confirmPassword: z.string().min(1, { message: 'auth.resetPassword.validation.requiredConfirm' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'auth.resetPassword.validation.passwordsMismatch',
    path: ['confirmPassword'],
  });

export type ResetPasswordSchema = z.infer<typeof resetPasswordSchema>;
