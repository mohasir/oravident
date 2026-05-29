import { z } from 'zod';
import { createIdParamSchema, createIdSchema } from '@common/schemas/common.schema.ts';
import { TypedRequest } from '@common/types/requests.ts';

// ==========================================
// 1. CORE DOMAIN SCHEMAS
// ==========================================

export const upsertBranchServiceSchema = z
  .object({
    priceOverride: z
      .string()
      .regex(/^\d+(\.\d{1,2})?$/, 'Invalid price format')
      .optional()
      .nullable(),
    isActive: z.boolean().optional(),
  })
  .strict();

export const branchServiceFiltersSchema = z
  .object({
    id: createIdSchema('id').optional(),
    branchId: createIdSchema('branchId').optional(),
    serviceId: createIdSchema('serviceId').optional(),
    clinicId: createIdSchema('clinicId').optional(),
    isActive: z.boolean().optional(),
  })
  .strict();

// ==========================================
// 2. API REQUEST SCHEMAS
// ==========================================

const branchIdParamSchema = z.object({
  branchId: createIdParamSchema('branchId'),
});

const branchServiceParamsSchema = z.object({
  branchId: createIdParamSchema('branchId'),
  serviceId: createIdParamSchema('serviceId'),
});

export const getBranchServicesRequestSchema = {
  params: branchIdParamSchema,
};

export const upsertBranchServiceRequestSchema = {
  params: branchServiceParamsSchema,
  body: upsertBranchServiceSchema,
};

export const deleteBranchServiceRequestSchema = {
  params: branchServiceParamsSchema,
};

// ==========================================
// 3. DTOs & DOMAIN TYPES
// ==========================================

export type UpsertBranchServiceDTO = z.infer<typeof upsertBranchServiceSchema>;
export type BranchServiceFiltersDTO = z.infer<typeof branchServiceFiltersSchema>;

// ==========================================
// 4. TYPED REQUESTS
// ==========================================

export type GetBranchServicesRequest   = TypedRequest<typeof getBranchServicesRequestSchema>;
export type UpsertBranchServiceRequest = TypedRequest<typeof upsertBranchServiceRequestSchema>;
export type DeleteBranchServiceRequest = TypedRequest<typeof deleteBranchServiceRequestSchema>;
