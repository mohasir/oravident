import { z } from 'zod';
import { createIdParamSchema, createIdSchema } from '@common/schemas/common.schema.ts';
import { TypedRequest } from '@common/types/requests.ts';
import { DB_LIMITS } from '@core/db/constants.ts';

// ==========================================
// 1. CORE DOMAIN SCHEMAS
// ==========================================

export const createScheduleBlockSchema = z
  .object({
    branchId: createIdSchema('branchId').optional(),
    startAt: z.iso.datetime({ message: 'Invalid datetime format for startAt' }),
    endAt: z.iso.datetime({ message: 'Invalid datetime format for endAt' }),
    reason: z.string().max(DB_LIMITS.SHORT_NAME ?? 200).optional(),
  })
  .strict()
  .refine((d) => new Date(d.endAt) > new Date(d.startAt), {
    message: 'endAt must be after startAt',
    path: ['endAt'],
  });

export const updateScheduleBlockSchema = z
  .object({
    branchId: createIdSchema('branchId').optional(),
    startAt: z.iso.datetime({ message: 'Invalid datetime format for startAt' }).optional(),
    endAt: z.iso.datetime({ message: 'Invalid datetime format for endAt' }).optional(),
    reason: z.string().max(DB_LIMITS.SHORT_NAME ?? 200).optional(),
  })
  .strict()
  .refine(
    (d) => {
      if (d.startAt && d.endAt) return new Date(d.endAt) > new Date(d.startAt);
      return true;
    },
    { message: 'endAt must be after startAt', path: ['endAt'] },
  );

export const scheduleBlockFiltersSchema = z
  .object({
    id: createIdSchema('id').optional(),
    workerId: createIdSchema('workerId').optional(),
    clinicId: createIdSchema('clinicId').optional(),
    branchId: createIdSchema('branchId').optional(),
  })
  .strict();

// ==========================================
// 2. API REQUEST SCHEMAS
// ==========================================

const workerIdParamSchema = z.object({
  workerId: createIdParamSchema('workerId'),
});

const workerBlockParamsSchema = z.object({
  workerId: createIdParamSchema('workerId'),
  blockId: createIdParamSchema('blockId'),
});

export const createScheduleBlockRequestSchema = {
  params: workerIdParamSchema,
  body: createScheduleBlockSchema,
};

export const updateScheduleBlockRequestSchema = {
  params: workerBlockParamsSchema,
  body: updateScheduleBlockSchema,
};

export const getScheduleBlocksRequestSchema = {
  params: workerIdParamSchema,
};

export const deleteScheduleBlockRequestSchema = {
  params: workerBlockParamsSchema,
};

// ==========================================
// 3. DTOs & DOMAIN TYPES
// ==========================================

export type CreateScheduleBlockDTO = z.infer<typeof createScheduleBlockSchema>;
export type UpdateScheduleBlockDTO = z.infer<typeof updateScheduleBlockSchema>;
export type ScheduleBlockFiltersDTO = z.infer<typeof scheduleBlockFiltersSchema>;

// ==========================================
// 4. TYPED REQUESTS
// ==========================================

export type CreateScheduleBlockRequest = TypedRequest<typeof createScheduleBlockRequestSchema>;
export type UpdateScheduleBlockRequest = TypedRequest<typeof updateScheduleBlockRequestSchema>;
export type GetScheduleBlocksRequest   = TypedRequest<typeof getScheduleBlocksRequestSchema>;
export type DeleteScheduleBlockRequest = TypedRequest<typeof deleteScheduleBlockRequestSchema>;
