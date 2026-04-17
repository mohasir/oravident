import { z } from 'zod';
import { DB_LIMITS } from '@/core/db/constants.ts';

export const createClinicSchema = z
  .object({
    name: z.string().min(2).max(DB_LIMITS.NAME),
    slug: z.string().min(2).max(DB_LIMITS.SLUG),
    email: z.email().max(DB_LIMITS.EMAIL),
    phone: z.string().max(DB_LIMITS.PHONE).optional(),
    logoUrl: z.url().max(DB_LIMITS.URL).optional(),
    timeZone: z.string().max(DB_LIMITS.TIMEZONE).default('America/Managua'),
    settings: z.record(z.string(), z.unknown()).optional(),
  })
  .strict();

export type CreateClinicDTO = z.infer<typeof createClinicSchema>;

export type ClinicFilters = {
  id?: string;
  slug?: string;
  email?: string;
  isActive?: boolean;
};
