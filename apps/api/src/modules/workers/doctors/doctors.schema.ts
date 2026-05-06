import { z } from 'zod';
import { DB_LIMITS } from '@/core/db/constants.ts';
import { TypedRequest, commonIdParamSchema } from '@/common/types/requests.ts';
import { baseWorkerSchema, workerFiltersSchema } from '@modules/workers/workers.schema.ts';
import { paginationQuerySchema } from '@/common/schemas/common.schema.ts';

// ==========================================
// 1. DOCTOR SCHEMAS
// ==========================================

export const createDoctorSchema = baseWorkerSchema.extend({
  prefix: z.string().max(DB_LIMITS.PREFIX).optional().nullable(),
  specialty: z.string().max(DB_LIMITS.NAME).optional().nullable(),
  licenseNumber: z.string().max(DB_LIMITS.SHORT_NAME).optional().nullable(),
});

export const updateDoctorSchema = createDoctorSchema
  .partial()
  .omit({ userId: true })
  .strict();

export const getDoctorsQuerySchema = paginationQuerySchema.extend(
  workerFiltersSchema.shape,
);

// ==========================================
// 2. API REQUEST SCHEMAS
// ==========================================

export const createDoctorRequestSchema = {
  body: createDoctorSchema,
};

export const getDoctorsRequestSchema = {
  query: getDoctorsQuerySchema,
};

export const updateDoctorRequestSchema = {
  params: commonIdParamSchema.params,
  body: updateDoctorSchema,
};

export const getDoctorRequestSchema = {
  params: commonIdParamSchema.params,
};

// ==========================================
// 3. TYPED REQUESTS & DTOs
// ==========================================

export type CreateDoctorDTO = z.infer<typeof createDoctorSchema>;
export type UpdateDoctorDTO = z.infer<typeof updateDoctorSchema>;

export type CreateDoctorRequest = TypedRequest<
  typeof createDoctorRequestSchema
>;
export type GetDoctorsRequest = TypedRequest<typeof getDoctorsRequestSchema>;
export type UpdateDoctorRequest = TypedRequest<
  typeof updateDoctorRequestSchema
>;
export type GetDoctorRequest = TypedRequest<typeof getDoctorRequestSchema>;
