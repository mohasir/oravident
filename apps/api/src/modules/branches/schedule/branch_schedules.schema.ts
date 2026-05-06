import { z } from 'zod';
import { createIdParamSchema, createIdSchema } from '@common/schemas/common.schema.ts';
import { TypedRequest } from '@common/types/requests.ts';

// dayOfWeek: 1=Monday, 2=Tuesday, 3=Wednesday, 4=Thursday, 5=Friday, 6=Saturday, 7=Sunday
const dayOfWeekSchema = z.coerce
  .number()
  .int()
  .min(1)
  .max(7);

const timeSchema = z
  .string()
  .regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Time must be in HH:MM format');

// Reusable input schema (used in branch create payload)
export const scheduleInputSchema = z
  .object({
    dayOfWeek: dayOfWeekSchema,
    openTime: timeSchema,
    closeTime: timeSchema,
  })
  .strict()
  .refine((data) => data.openTime < data.closeTime, {
    message: 'openTime must be before closeTime',
    path: ['closeTime'],
  });

export type ScheduleInputDTO = z.infer<typeof scheduleInputSchema>;

// ==========================================
// 1. CORE DOMAIN SCHEMAS
// ==========================================

export const createBranchScheduleSchema = z
  .object({
    dayOfWeek: dayOfWeekSchema,
    openTime: timeSchema,
    closeTime: timeSchema,
  })
  .strict()
  .refine((data) => data.openTime < data.closeTime, {
    message: 'openTime must be before closeTime',
    path: ['closeTime'],
  });

export const updateBranchScheduleSchema = z
  .object({
    openTime: timeSchema.optional(),
    closeTime: timeSchema.optional(),
    isActive: z.boolean().optional(),
  })
  .strict()
  .refine(
    (data) => {
      if (data.openTime && data.closeTime) {
        return data.openTime < data.closeTime;
      }
      return true;
    },
    { message: 'openTime must be before closeTime', path: ['closeTime'] },
  );

export const branchScheduleFiltersSchema = z
  .object({
    id: createIdSchema('id').optional(),
    branchId: createIdSchema('branchId').optional(),
    clinicId: createIdSchema('clinicId').optional(),
    dayOfWeek: z.coerce.number().int().min(1).max(7).optional(),
    isActive: z.boolean().optional(),
  })
  .strict();

// ==========================================
// 2. API REQUEST SCHEMAS
// ==========================================

const branchIdParamSchema = z.object({
  branchId: createIdParamSchema('branchId'),
});

const branchScheduleParamsSchema = z.object({
  branchId: createIdParamSchema('branchId'),
  scheduleId: createIdParamSchema('scheduleId'),
});

export const createBranchScheduleRequestSchema = {
  params: branchIdParamSchema,
  body: createBranchScheduleSchema,
};

export const updateBranchScheduleRequestSchema = {
  params: branchScheduleParamsSchema,
  body: updateBranchScheduleSchema,
};

export const getBranchSchedulesRequestSchema = {
  params: branchIdParamSchema,
};

export const deleteBranchScheduleRequestSchema = {
  params: branchScheduleParamsSchema,
};

// ==========================================
// 3. DTOs & DOMAIN TYPES
// ==========================================

export type CreateBranchScheduleDTO = z.infer<typeof createBranchScheduleSchema>;
export type UpdateBranchScheduleDTO = z.infer<typeof updateBranchScheduleSchema>;
export type BranchScheduleFiltersDTO = z.infer<typeof branchScheduleFiltersSchema>;

// ==========================================
// 4. TYPED REQUESTS
// ==========================================

export type CreateBranchScheduleRequest = TypedRequest<typeof createBranchScheduleRequestSchema>;
export type UpdateBranchScheduleRequest = TypedRequest<typeof updateBranchScheduleRequestSchema>;
export type GetBranchSchedulesRequest   = TypedRequest<typeof getBranchSchedulesRequestSchema>;
export type DeleteBranchScheduleRequest = TypedRequest<typeof deleteBranchScheduleRequestSchema>;
