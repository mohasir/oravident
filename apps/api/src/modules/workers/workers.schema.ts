import { z } from 'zod';
import { DB_LIMITS } from '@/core/db/constants.ts';
import { Genders, ContractTypes } from '@/core/db/enums.ts';

export const createWorkerSchema = z
  .object({
    clinicId: z.uuid(),
    userId: z.uuid(),
    roleId: z.uuid(),
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

export type CreateWorkerDTO = z.infer<typeof createWorkerSchema>;
export type UpdateWorkerDTO = z.infer<typeof updateWorkerSchema>;

export type WorkerFilters = {
  id?: string;
  clinicId?: string;
  userId?: string;
  roleId?: string;
  isActive?: boolean;
};
