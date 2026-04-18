import { z } from 'zod';
import { DB_LIMITS } from '@/core/db/constants.ts';
import { Genders, ContractTypes } from '@/core/db/enums.ts';
import {
  createIdSchema,
  paginationQuerySchema,
} from '@/common/schemas/common.schema.ts';
import { commonIdParamSchema, TypedRequest } from '@/common/types/requests.ts';

// ==========================================
// 1. CORE DOMAIN SCHEMAS
// ==========================================

export const createWorkerSchema = z
  .object({
    clinicId: createIdSchema('Clinic'),
    userId: createIdSchema('User'),
    roleId: createIdSchema('Role'),
    firstName: z.string().min(1).max(DB_LIMITS.NAME),
    secondName: z.string().max(DB_LIMITS.NAME).optional().nullable(),
    lastName: z.string().min(1).max(DB_LIMITS.NAME),
    secondLastName: z.string().max(DB_LIMITS.NAME).optional().nullable(),
    phone: z.string().min(1).max(DB_LIMITS.PHONE),
    dateOfBirth: z.string().optional().nullable(),
    gender: z.enum(Genders),
    prefix: z.string().max(DB_LIMITS.PREFIX).optional().nullable(),
    specialty: z.string().max(DB_LIMITS.NAME).optional().nullable(),
    idNumber: z.string().max(DB_LIMITS.ID_NUMBER).optional().nullable(),
    licenseNumber: z.string().max(DB_LIMITS.SHORT_NAME).optional().nullable(),
    calendarColor: z
      .string()
      .regex(/^#[0-9A-F]{6}$/i)
      .optional(),
    contractType: z.enum(ContractTypes).optional(),
  })
  .strict();

export const updateWorkerSchema = createWorkerSchema
  .partial()
  .omit({ clinicId: true, userId: true })
  .strict();

export const workerFiltersSchema = z
  .object({
    id: createIdSchema('id').optional(),
    clinicId: createIdSchema('Clinic').optional(),
    userId: createIdSchema('User').optional(),
    roleId: createIdSchema('Role').optional(),
    isActive: z.boolean().optional(),
  })
  .strict();

export const getWorkersQuerySchema = paginationQuerySchema.extend(
  workerFiltersSchema.shape,
);

// ==========================================
// 2. API REQUEST SCHEMAS
// ==========================================

export const createWorkerRequestSchema = {
  body: createWorkerSchema,
};

export const getWorkersRequestSchema = {
  query: getWorkersQuerySchema,
};

export const updateWorkerRequestSchema = {
  params: commonIdParamSchema.params,
  body: updateWorkerSchema,
};

export const getWorkerRequestSchema = {
  params: commonIdParamSchema.params,
};

// ==========================================
// 3. DTOs & DOMAIN TYPES
// ==========================================

export type CreateWorkerDTO = z.infer<typeof createWorkerSchema>;
export type UpdateWorkerDTO = z.infer<typeof updateWorkerSchema>;
export type WorkerFiltersDTO = z.infer<typeof workerFiltersSchema>;
export type GetWorkersQueryDTO = z.infer<typeof getWorkersQuerySchema>;

// ==========================================
// 4. TYPED REQUESTS
// ==========================================

export type CreateWorkerRequest = TypedRequest<typeof createWorkerRequestSchema>;
export type GetWorkersRequest = TypedRequest<typeof getWorkersRequestSchema>;
export type UpdateWorkerRequest = TypedRequest<typeof updateWorkerRequestSchema>;
export type GetWorkerRequest = TypedRequest<typeof getWorkerRequestSchema>;
