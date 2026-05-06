import { z } from 'zod';
import { DB_LIMITS } from '@core/db/constants.ts';
import {
  createIdParamSchema,
  createIdSchema,
  emailSchema,
  paginationQuerySchema,
} from '@common/schemas/common.schema.ts';
import { commonIdParamSchema, TypedRequest } from '@common/types/requests.ts';
import { scheduleInputSchema } from '@modules/branches/schedule/branch_schedules.schema.ts';

// ==========================================
// 1. CORE DOMAIN SCHEMAS
// ==========================================

export const createBranchSchema = z
  .object({
    name: z.string().min(1).max(DB_LIMITS.NAME),
    address: z.string().min(1).max(DB_LIMITS.ADDRESS),
    email: emailSchema.optional(),
    phone: z.string().max(DB_LIMITS.PHONE).optional(),
    latitude: z.string().optional(),
    longitude: z.string().optional(),
    color: z.string().max(DB_LIMITS.COLOR_HEX).optional(),
    settings: z.record(z.string(), z.unknown()).optional(),
    schedules: z
      .array(scheduleInputSchema)
      .max(7)
      .optional()
      .refine(
        (items) => {
          if (!items) return true;
          const days = items.map((s) => s.dayOfWeek);
          return new Set(days).size === days.length;
        },
        { message: 'Each day of the week can only appear once' },
      ),
  })
  .strict();

export const updateBranchSchema = createBranchSchema.partial();

export const branchFiltersSchema = z
  .object({
    id: createIdSchema('id').optional(),
    clinicId: createIdSchema('clinicId').optional(),
    name: z.string().optional(),
    slug: z.string().optional(),
    email: z.string().optional(),
    isActive: z.boolean().optional(),
  })
  .strict();

export const getBranchesQuerySchema = paginationQuerySchema.extend(
  branchFiltersSchema.shape,
);

// ==========================================
// 2. API REQUEST SCHEMAS
// ==========================================

export const createBranchRequestSchema = {
  body: createBranchSchema,
};

export const createBranchSuperadminRequestSchema = {
  params: z.object({
    clinicId: createIdParamSchema('clinicId'),
  }),
  body: createBranchSchema,
};

export const getBranchesRequestSchema = {
  query: getBranchesQuerySchema,
};

export const updateBranchRequestSchema = {
  params: commonIdParamSchema.params,
  body: updateBranchSchema,
};

export const getBranchRequestSchema = {
  params: commonIdParamSchema.params,
};

// ==========================================
// 3. DTOs & DOMAIN TYPES
// ==========================================

export type CreateBranchDTO = z.infer<typeof createBranchSchema>;
export type UpdateBranchDTO = z.infer<typeof updateBranchSchema>;
export type BranchFiltersDTO = z.infer<typeof branchFiltersSchema>;
export type GetBranchesQueryDTO = z.infer<typeof getBranchesQuerySchema>;

// ==========================================
// 4. TYPED REQUESTS
// ==========================================

export type CreateBranchRequest = TypedRequest<
  typeof createBranchRequestSchema
>;
export type createBranchSuperadminRequest = TypedRequest<
  typeof createBranchSuperadminRequestSchema
>;
export type GetBranchesRequest = TypedRequest<typeof getBranchesRequestSchema>;
export type UpdateBranchRequest = TypedRequest<
  typeof updateBranchRequestSchema
>;
export type GetBranchRequest = TypedRequest<typeof getBranchRequestSchema>;
