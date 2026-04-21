import { z } from 'zod';
import { DB_LIMITS } from '@core/db/constants.ts';
import {
  createIdSchema,
  paginationQuerySchema,
} from '@common/schemas/common.schema.ts';
import { commonIdParamSchema, TypedRequest } from '@common/types/requests.ts';

// ==========================================
// 1. CORE DOMAIN SCHEMAS
// ==========================================

export const createServiceSchema = z
  .object({
    clinicId: createIdSchema('clinicId'),
    name: z.string().min(2).max(DB_LIMITS.NAME),
    description: z.string().optional(),
    durationMinutes: z.number().int().min(5).max(480).default(30),
    price: z
      .string()
      .regex(/^\d+(\.\d{1,2})?$/, 'Invalid price format')
      .optional(),
    isActive: z.boolean().optional().default(true),
  })
  .strict();

export const updateServiceSchema = createServiceSchema.partial();

export const serviceFiltersSchema = z
  .object({
    id: createIdSchema('id').optional(),
    name: z.string().optional(),
    isActive: z.boolean().optional(),
    excludeId: createIdSchema('excludeId').optional(),
  })
  .strict();

export const getServicesQuerySchema = paginationQuerySchema.extend(
  serviceFiltersSchema.shape,
);

// ==========================================
// 2. API REQUEST SCHEMAS
// ==========================================

export const createServiceRequestSchema = {
  body: createServiceSchema,
};

export const getServicesRequestSchema = {
  query: getServicesQuerySchema,
};

export const updateServiceRequestSchema = {
  params: commonIdParamSchema.params,
  body: updateServiceSchema,
};

export const getServiceRequestSchema = {
  params: commonIdParamSchema.params,
};

export const deleteServiceRequestSchema = {
  params: commonIdParamSchema.params,
};

// ==========================================
// 3. DTOs & DOMAIN TYPES
// ==========================================

export type CreateServiceDTO = z.infer<typeof createServiceSchema>;
export type UpdateServiceDTO = z.infer<typeof updateServiceSchema>;
export type ServiceFiltersDTO = z.infer<typeof serviceFiltersSchema>;
export type GetServicesQueryDTO = z.infer<typeof getServicesQuerySchema>;

// ==========================================
// 4. TYPED REQUESTS
// ==========================================

export type CreateServiceRequest = TypedRequest<
  typeof createServiceRequestSchema
>;
export type GetServicesRequest = TypedRequest<typeof getServicesRequestSchema>;
export type UpdateServiceRequest = TypedRequest<
  typeof updateServiceRequestSchema
>;
export type GetServiceRequest = TypedRequest<typeof getServiceRequestSchema>;
export type DeleteServiceRequest = TypedRequest<
  typeof deleteServiceRequestSchema
>;
