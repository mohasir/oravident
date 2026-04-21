import { z } from 'zod';
import { DB_LIMITS } from '@core/db/constants.ts';
import {
  createIdSchema,
  emailSchema,
  paginationQuerySchema,
} from '@common/schemas/common.schema.ts';
import { commonIdParamSchema, TypedRequest } from '@common/types/requests.ts';

// ==========================================
// 1. CORE DOMAIN SCHEMAS
// ==========================================

export const createClinicSchema = z
  .object({
    name: z.string().min(2).max(DB_LIMITS.NAME),
    email: emailSchema,
    phone: z.string().max(DB_LIMITS.PHONE).optional(),
    logoUrl: z.url().max(DB_LIMITS.URL).optional(),
    timeZone: z.string().max(DB_LIMITS.TIMEZONE).default('America/Managua'),
    settings: z.record(z.string(), z.unknown()).optional(),
  })
  .strict();

export const updateClinicSchema = createClinicSchema.partial();

export const clinicFiltersSchema = z
  .object({
    id: createIdSchema('id').optional(),
    name: z.string().optional(),
    slug: z.string().optional(),
    email: z.string().optional(),
    isActive: z.boolean().optional(),
  })
  .strict();

export const getClinicsQuerySchema = paginationQuerySchema.extend(
  clinicFiltersSchema.shape,
);

// ==========================================
// 2. API REQUEST SCHEMAS
// ==========================================

export const createClinicRequestSchema = {
  body: createClinicSchema,
};

export const getClinicsRequestSchema = {
  query: getClinicsQuerySchema,
};

export const updateClinicRequestSchema = {
  params: commonIdParamSchema.params,
  body: updateClinicSchema,
};

export const getClinicRequestSchema = {
  params: commonIdParamSchema.params,
};

// ==========================================
// 3. DTOs & DOMAIN TYPES
// ==========================================

export type CreateClinicDTO = z.infer<typeof createClinicSchema>;
export type UpdateClinicDTO = z.infer<typeof updateClinicSchema>;
export type ClinicFiltersDTO = z.infer<typeof clinicFiltersSchema>;
export type GetClinicsQueryDTO = z.infer<typeof getClinicsQuerySchema>;

// ==========================================
// 4. TYPED REQUESTS
// ==========================================

export type CreateClinicRequest = TypedRequest<
  typeof createClinicRequestSchema
>;
export type GetClinicsRequest = TypedRequest<typeof getClinicsRequestSchema>;
export type UpdateClinicRequest = TypedRequest<
  typeof updateClinicRequestSchema
>;
export type GetClinicRequest = TypedRequest<typeof getClinicRequestSchema>;
