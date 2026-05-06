import { z } from 'zod';
import { DB_LIMITS } from '@/core/db/constants.ts';
import { Genders, ContractTypes } from '@/core/db/enums.ts';
import {
  createIdSchema,
  paginationQuerySchema,
} from '@/common/schemas/common.schema.ts';

// ==========================================
// 1. BASE DOMAIN SCHEMAS
// ==========================================

export const baseWorkerSchema = z
  .object({
    userId: createIdSchema('User'),
    firstName: z.string().min(1).max(DB_LIMITS.NAME),
    secondName: z.string().max(DB_LIMITS.NAME).optional().nullable(),
    lastName: z.string().min(1).max(DB_LIMITS.NAME),
    secondLastName: z.string().max(DB_LIMITS.NAME).optional().nullable(),
    phone: z.string().min(1).max(DB_LIMITS.PHONE),
    dateOfBirth: z.string().optional().nullable(),
    gender: z.enum(Genders),
    idNumber: z.string().max(DB_LIMITS.ID_NUMBER).optional().nullable(),
    calendarColor: z
      .string()
      .regex(/^#[0-9A-F]{6}$/i)
      .optional(),
    contractType: z.enum(ContractTypes).optional(),
  })
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
// 2. DTOs & TYPES
// ==========================================

export type WorkerFiltersDTO = z.infer<typeof workerFiltersSchema>;
export type GetWorkersQueryDTO = z.infer<typeof getWorkersQuerySchema>;
