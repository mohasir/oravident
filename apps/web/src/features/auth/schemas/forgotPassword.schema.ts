import * as z from 'zod';

export const forgotPasswordSchema = z.object({
  email: z.email({ message: 'auth.forgotPassword.validation.invalidEmail' }),
});

export type ForgotPasswordSchema = z.infer<typeof forgotPasswordSchema>;
