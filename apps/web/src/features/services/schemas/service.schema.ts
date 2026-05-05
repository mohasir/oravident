import { z } from 'zod';

export const createServiceSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(120),
  description: z.string().optional().or(z.literal('')),
  durationMinutes: z.number().int().min(5).max(480),
  price: z
    .string()
    .regex(/^\d+(\.\d{1,2})?$/, 'Invalid price format')
    .optional()
    .or(z.literal('')),
});

export type CreateServiceSchema = z.infer<typeof createServiceSchema>;
