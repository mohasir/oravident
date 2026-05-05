import { z } from 'zod';

export const createBranchSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  slug: z.string().min(2, 'Slug must be at least 2 characters').max(100),
  address: z.string().min(1, 'Address is required'),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  phone: z.string().max(20).optional().or(z.literal('')),
  latitude: z.string().optional().or(z.literal('')),
  longitude: z.string().optional().or(z.literal('')),
  color: z.string().max(7).optional().or(z.literal('')),
  settings: z.record(z.string(), z.unknown()).optional(),
});

export type CreateBranchSchema = z.infer<typeof createBranchSchema>;
