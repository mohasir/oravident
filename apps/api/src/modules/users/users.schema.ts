import { z } from 'zod';
import { createIdSchema, emailSchema } from '@/common/schemas/common.schema.ts';

// ==========================================
// 1. CORE DOMAIN SCHEMAS
// ==========================================

export const userFiltersSchema = z
  .object({
    id: createIdSchema('id').optional(),
    email: emailSchema.optional(),
    isActive: z.boolean().optional(),
  })
  .strict();

export const workerProfileRowSchema = z.object({
  user: z.object({
    id: z.string(),
    email: emailSchema,
    passwordHash: z.string(),
  }),
  worker: z
    .object({
      clinicId: z.string().nullable(),
    })
    .nullable(),
  role: z
    .object({
      id: z.string().nullable(),
      name: z.string().nullable(),
    })
    .nullable(),
  permission: z
    .object({
      id: z.string().nullable(),
      code: z.string().nullable(),
    })
    .nullable(),
});

// ==========================================
// 2. DTOs & DOMAIN TYPES
// ==========================================

export type UserFiltersDTO = z.infer<typeof userFiltersSchema>;
export type WorkerProfileRowDTO = z.infer<typeof workerProfileRowSchema>;
