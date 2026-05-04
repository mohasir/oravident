import * as z from 'zod';

export const loginSchema = z.object({
  email: z.email({ message: 'auth.login.validation.invalidEmail' }),
  password: z
    .string()
    .min(1, { message: 'auth.login.validation.requiredPassword' }),
  remember: z.boolean().optional(),
});

export type LoginSchema = z.infer<typeof loginSchema>;
