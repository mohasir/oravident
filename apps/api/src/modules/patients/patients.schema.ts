import { z } from 'zod';
import { DB_LIMITS } from '@core/db/constants.ts';
import {
  createIdSchema,
  emailSchema,
  paginationQuerySchema,
} from '@common/schemas/common.schema.ts';
import { commonIdParamSchema, TypedRequest } from '@common/types/requests.ts';
import { Genders } from '@core/db/enums.ts';

// ==========================================
// 1. CORE DOMAIN SCHEMAS
// ==========================================

export const createPatientSchema = z
  .object({
    primaryBranchId: createIdSchema('primaryBranchId').optional(),
    firstName: z.string().min(1).max(DB_LIMITS.NAME),
    secondName: z.string().max(DB_LIMITS.NAME).optional(),
    lastName: z.string().min(1).max(DB_LIMITS.NAME),
    secondLastName: z.string().max(DB_LIMITS.NAME).optional(),
    idNumber: z.string().max(DB_LIMITS.ID_NUMBER).optional(),
    email: emailSchema.optional(),
    phone: z.string().min(7).max(DB_LIMITS.PHONE),
    dateOfBirth: z.iso.date().optional(),
    gender: z.enum(Genders).optional(),
    address: z.string().optional(),
    medicalNotes: z.string().optional(),
  })
  .strict();

export const updatePatientSchema = createPatientSchema.partial();

export const patientFiltersSchema = z
  .object({
    id: createIdSchema('id').optional(),
    clinicId: createIdSchema('clinicId').optional(),
    primaryBranchId: createIdSchema('primaryBranchId').optional(),
    idNumber: z.string().max(DB_LIMITS.ID_NUMBER).optional(),
    email: emailSchema.optional(),
    phone: z.string().optional(),
    isActive: z.boolean().optional(),
  })
  .strict();

export const getPatientsQuerySchema = paginationQuerySchema.extend(
  patientFiltersSchema.shape,
);

// ==========================================
// 2. API REQUEST SCHEMAS
// ==========================================

export const createPatientRequestSchema = {
  body: createPatientSchema,
};

export const createPatientSuperadminRequestSchema = {
  params: z.object({
    clinicId: createIdSchema('clinicId'),
  }),
  body: createPatientSchema,
};

export const getPatientsRequestSchema = {
  query: getPatientsQuerySchema,
};

export const updatePatientRequestSchema = {
  params: commonIdParamSchema.params,
  body: updatePatientSchema,
};

export const getPatientRequestSchema = {
  params: commonIdParamSchema.params,
};

export const deletePatientRequestSchema = {
  params: commonIdParamSchema.params,
};

// ==========================================
// 3. DTOs & DOMAIN TYPES
// ==========================================

export type CreatePatientDTO = z.infer<typeof createPatientSchema>;
export type UpdatePatientDTO = z.infer<typeof updatePatientSchema>;
export type PatientFiltersDTO = z.infer<typeof patientFiltersSchema>;
export type GetPatientsQueryDTO = z.infer<typeof getPatientsQuerySchema>;

// ==========================================
// 4. TYPED REQUESTS
// ==========================================

export type CreatePatientRequest = TypedRequest<
  typeof createPatientRequestSchema
>;

export type CreatePatientSuperadminRequest = TypedRequest<
  typeof createPatientSuperadminRequestSchema
>;

export type GetPatientsRequest = TypedRequest<typeof getPatientsRequestSchema>;
export type UpdatePatientRequest = TypedRequest<
  typeof updatePatientRequestSchema
>;
export type GetPatientRequest = TypedRequest<typeof getPatientRequestSchema>;
export type DeletePatientRequest = TypedRequest<
  typeof deletePatientRequestSchema
>;

