import { z } from 'zod';
import { createIdParamSchema, createIdSchema } from '@common/schemas/common.schema.ts';
import { TypedRequest } from '@common/types/requests.ts';

// dayOfWeek: 1=Monday ... 7=Sunday
const dayOfWeekSchema = z.coerce.number().int().min(1).max(7);

const timeSchema = z
  .string()
  .regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Time must be in HH:MM format');

// ==========================================
// 1. CORE DOMAIN SCHEMAS
// ==========================================

export const createWorkerScheduleSchema = z
  .object({
    branchId: createIdSchema('branchId'),
    dayOfWeek: dayOfWeekSchema,
    startTime: timeSchema,
    endTime: timeSchema,
  })
  .strict()
  .refine((d) => d.startTime < d.endTime, {
    message: 'startTime must be before endTime',
    path: ['endTime'],
  });

export const updateWorkerScheduleSchema = z
  .object({
    startTime: timeSchema.optional(),
    endTime: timeSchema.optional(),
    isActive: z.boolean().optional(),
  })
  .strict()
  .refine(
    (d) => {
      if (d.startTime && d.endTime) return d.startTime < d.endTime;
      return true;
    },
    { message: 'startTime must be before endTime', path: ['endTime'] },
  );

export const workerScheduleFiltersSchema = z
  .object({
    id: createIdSchema('id').optional(),
    workerId: createIdSchema('workerId').optional(),
    branchId: createIdSchema('branchId').optional(),
    clinicId: createIdSchema('clinicId').optional(),
    dayOfWeek: z.coerce.number().int().min(1).max(7).optional(),
    isActive: z.boolean().optional(),
  })
  .strict();

// ==========================================
// 2. API REQUEST SCHEMAS
// ==========================================

const workerIdParamSchema = z.object({
  workerId: createIdParamSchema('workerId'),
});

const workerScheduleParamsSchema = z.object({
  workerId: createIdParamSchema('workerId'),
  scheduleId: createIdParamSchema('scheduleId'),
});

export const createWorkerScheduleRequestSchema = {
  params: workerIdParamSchema,
  body: createWorkerScheduleSchema,
};

export const updateWorkerScheduleRequestSchema = {
  params: workerScheduleParamsSchema,
  body: updateWorkerScheduleSchema,
};

export const getWorkerSchedulesRequestSchema = {
  params: workerIdParamSchema,
};

export const deleteWorkerScheduleRequestSchema = {
  params: workerScheduleParamsSchema,
};

// ==========================================
// 3. DTOs & DOMAIN TYPES
// ==========================================

export type CreateWorkerScheduleDTO = z.infer<typeof createWorkerScheduleSchema>;
export type UpdateWorkerScheduleDTO = z.infer<typeof updateWorkerScheduleSchema>;
export type WorkerScheduleFiltersDTO = z.infer<typeof workerScheduleFiltersSchema>;

// ==========================================
// 4. TYPED REQUESTS
// ==========================================

export type CreateWorkerScheduleRequest = TypedRequest<typeof createWorkerScheduleRequestSchema>;
export type UpdateWorkerScheduleRequest = TypedRequest<typeof updateWorkerScheduleRequestSchema>;
export type GetWorkerSchedulesRequest   = TypedRequest<typeof getWorkerSchedulesRequestSchema>;
export type DeleteWorkerScheduleRequest = TypedRequest<typeof deleteWorkerScheduleRequestSchema>;
