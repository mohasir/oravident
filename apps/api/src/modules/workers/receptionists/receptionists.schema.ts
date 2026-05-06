import { z } from 'zod';
import { TypedRequest, commonIdParamSchema } from '@/common/types/requests.ts';
import {
  baseWorkerSchema,
  workerFiltersSchema,
} from '@modules/workers/workers.schema.ts';
import { paginationQuerySchema } from '@/common/schemas/common.schema.ts';

// ==========================================
// 1. RECEPTIONIST SPECIFIC SCHEMAS
// ==========================================

export const createReceptionistSchema = baseWorkerSchema;

export const updateReceptionistSchema = createReceptionistSchema
  .partial()
  .omit({ userId: true })
  .strict();

export const getReceptionistsQuerySchema = paginationQuerySchema.extend(
  workerFiltersSchema.shape,
);

// ==========================================
// 2. API REQUEST SCHEMAS
// ==========================================

export const createReceptionistRequestSchema = {
  body: createReceptionistSchema,
};

export const getReceptionistsRequestSchema = {
  query: getReceptionistsQuerySchema,
};

export const updateReceptionistRequestSchema = {
  params: commonIdParamSchema.params,
  body: updateReceptionistSchema,
};

export const getReceptionistRequestSchema = {
  params: commonIdParamSchema.params,
};

// ==========================================
// 3. TYPED REQUESTS & DTOs
// ==========================================

export type CreateReceptionistDTO = z.infer<typeof createReceptionistSchema>;
export type UpdateReceptionistDTO = z.infer<typeof updateReceptionistSchema>;

export type CreateReceptionistRequest = TypedRequest<typeof createReceptionistRequestSchema>;
export type GetReceptionistsRequest = TypedRequest<typeof getReceptionistsRequestSchema>;
export type UpdateReceptionistRequest = TypedRequest<typeof updateReceptionistRequestSchema>;
export type GetReceptionistRequest = TypedRequest<typeof getReceptionistRequestSchema>;
