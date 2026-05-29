import { z } from 'zod';
import {
  createIdSchema,
  paginationQuerySchema,
} from '@common/schemas/common.schema.ts';
import { commonIdParamSchema, TypedRequest } from '@common/types/requests.ts';

// ==========================================
// 1. CORE DOMAIN SCHEMAS
// ==========================================

const MIN_DURATION_MINUTES = 15;
const MAX_DURATION_HOURS = 8;

const appointmentInputSchema = z
  .object({
    clinicId: createIdSchema('clinicId').optional(),
    branchId: createIdSchema('branchId'),
    patientId: createIdSchema('patientId'),
    workerId: createIdSchema('workerId'),
    serviceId: createIdSchema('serviceId'),
    statusId: createIdSchema('statusId'),
    startsAt: z.iso.datetime({ message: 'Invalid datetime format for startsAt' }),
    endsAt: z.iso.datetime({ message: 'Invalid datetime format for endsAt' }),
    notes: z.string().optional(),
    price: z
      .string()
      .regex(/^\d+(\.\d{1,2})?$/, 'Invalid price format')
      .optional(),
    discountAmount: z
      .string()
      .regex(/^\d+(\.\d{1,2})?$/, 'Invalid discount amount format')
      .optional(),
    taxAmount: z
      .string()
      .regex(/^\d+(\.\d{1,2})?$/, 'Invalid tax amount format')
      .optional(),
    createdBy: createIdSchema('createdBy').optional(),
  })
  .strict();

export const createAppointmentSchema = appointmentInputSchema.superRefine(
  (data, ctx) => {
    const startsAt = new Date(data.startsAt);
    const endsAt = new Date(data.endsAt);
    const now = new Date();

    if (startsAt < now) {
      ctx.addIssue({
        code: 'custom',
        message: 'startsAt cannot be in the past',
        path: ['startsAt'],
      });
    }

    if (endsAt <= startsAt) {
      ctx.addIssue({
        code: 'custom',
        message: 'endsAt must be after startsAt',
        path: ['endsAt'],
      });
      return;
    }

    const durationMs = endsAt.getTime() - startsAt.getTime();
    const minMs = MIN_DURATION_MINUTES * 60 * 1000;
    const maxMs = MAX_DURATION_HOURS * 60 * 60 * 1000;

    if (durationMs < minMs) {
      ctx.addIssue({
        code: 'custom',
        message: `Appointment duration must be at least ${MIN_DURATION_MINUTES} minutes`,
        path: ['endsAt'],
      });
    }

    if (durationMs > maxMs) {
      ctx.addIssue({
        code: 'custom',
        message: `Appointment duration cannot exceed ${MAX_DURATION_HOURS} hours`,
        path: ['endsAt'],
      });
    }
  },
);

export const updateAppointmentSchema = appointmentInputSchema
  .omit({ clinicId: true })
  .partial()
  .superRefine((data, ctx) => {
    if (data.startsAt === undefined && data.endsAt === undefined) return;

    const startsAt = data.startsAt ? new Date(data.startsAt) : undefined;
    const endsAt = data.endsAt ? new Date(data.endsAt) : undefined;

    if (startsAt !== undefined && startsAt < new Date()) {
      ctx.addIssue({
        code: 'custom',
        message: 'startsAt cannot be in the past',
        path: ['startsAt'],
      });
    }

    if (startsAt !== undefined && endsAt !== undefined) {
      if (endsAt <= startsAt) {
        ctx.addIssue({
          code: 'custom',
          message: 'endsAt must be after startsAt',
          path: ['endsAt'],
        });
        return;
      }

      const durationMs = endsAt.getTime() - startsAt.getTime();
      const minMs = MIN_DURATION_MINUTES * 60 * 1000;
      const maxMs = MAX_DURATION_HOURS * 60 * 60 * 1000;

      if (durationMs < minMs) {
        ctx.addIssue({
          code: 'custom',
          message: `Appointment duration must be at least ${MIN_DURATION_MINUTES} minutes`,
          path: ['endsAt'],
        });
      }

      if (durationMs > maxMs) {
        ctx.addIssue({
          code: 'custom',
          message: `Appointment duration cannot exceed ${MAX_DURATION_HOURS} hours`,
          path: ['endsAt'],
        });
      }
    }
  });

export const cancelAppointmentSchema = z
  .object({
    cancelledBy: createIdSchema('cancelledBy'),
    cancelReason: z.string().optional(),
  })
  .strict();

export const appointmentFiltersSchema = z
  .object({
    id: createIdSchema('id').optional(),
    clinicId: createIdSchema('clinicId').optional(),
    branchId: createIdSchema('branchId').optional(),
    patientId: createIdSchema('patientId').optional(),
    workerId: createIdSchema('workerId').optional(),
    statusId: createIdSchema('statusId').optional(),
    isActive: z.boolean().optional(),
    startDate: z.iso.datetime({ message: 'Invalid datetime format for startDate' }).optional(),
    endDate: z.iso.datetime({ message: 'Invalid datetime format for endDate' }).optional(),
  })
  .strict();

export const getAppointmentsQuerySchema = paginationQuerySchema
  .extend({
    limit: z.coerce
      .number()
      .min(1, 'Limit must be at least 1')
      .max(1000, 'Limit cannot exceed 1000')
      .optional(),
    pageSize: z.coerce.number().optional(),
  })
  .extend(appointmentFiltersSchema.shape)
  .transform((data) => {
    if (data.pageSize && !data.limit) {
      return { ...data, limit: data.pageSize };
    }
    return data;
  });

// ==========================================
// 2. API REQUEST SCHEMAS
// ==========================================

export const createAppointmentRequestSchema = {
  body: createAppointmentSchema,
};

export const getAppointmentsRequestSchema = {
  query: getAppointmentsQuerySchema,
};

export const getAppointmentRequestSchema = {
  params: commonIdParamSchema.params,
};

export const updateAppointmentRequestSchema = {
  params: commonIdParamSchema.params,
  body: updateAppointmentSchema,
};

export const cancelAppointmentRequestSchema = {
  params: commonIdParamSchema.params,
  body: cancelAppointmentSchema,
};

export const deleteAppointmentRequestSchema = {
  params: commonIdParamSchema.params,
};

// ==========================================
// 3. DTOs & DOMAIN TYPES
// ==========================================

export type CreateAppointmentDTO = z.infer<typeof createAppointmentSchema>;
export type UpdateAppointmentDTO = z.infer<typeof updateAppointmentSchema>;
export type CancelAppointmentDTO = z.infer<typeof cancelAppointmentSchema>;
export type AppointmentFiltersDTO = z.infer<typeof appointmentFiltersSchema>;
export type GetAppointmentsQueryDTO = z.infer<typeof getAppointmentsQuerySchema>;

// ==========================================
// 4. TYPED REQUESTS
// ==========================================

export type CreateAppointmentRequest = TypedRequest<
  typeof createAppointmentRequestSchema
>;
export type GetAppointmentsRequest = TypedRequest<
  typeof getAppointmentsRequestSchema
>;
export type GetAppointmentRequest = TypedRequest<
  typeof getAppointmentRequestSchema
>;
export type UpdateAppointmentRequest = TypedRequest<
  typeof updateAppointmentRequestSchema
>;
export type CancelAppointmentRequest = TypedRequest<
  typeof cancelAppointmentRequestSchema
>;
export type DeleteAppointmentRequest = TypedRequest<
  typeof deleteAppointmentRequestSchema
>;
