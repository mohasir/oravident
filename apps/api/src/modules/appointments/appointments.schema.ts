import { z } from 'zod';
import {
  createIdSchema,
  paginationQuerySchema,
} from '@common/schemas/common.schema.ts';
import { commonIdParamSchema, TypedRequest } from '@common/types/requests.ts';

// ==========================================
// 1. CORE DOMAIN SCHEMAS
// ==========================================

export const createAppointmentSchema = z
  .object({
    clinicId: createIdSchema('clinicId'),
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

export const updateAppointmentSchema = createAppointmentSchema
  .omit({ clinicId: true })
  .partial();

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

export const getAppointmentsQuerySchema = paginationQuerySchema.extend(
  appointmentFiltersSchema.shape,
);

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
