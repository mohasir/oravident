import { z } from 'zod';

export const createPatientSchema = z.object({
  firstName: z.string().min(1, 'patient.validation.firstNameRequired').max(100),
  secondName: z.string().max(100).optional().or(z.literal('')),
  lastName: z.string().min(1, 'patient.validation.lastNameRequired').max(100),
  secondLastName: z.string().max(100).optional().or(z.literal('')),
  idNumber: z.string().max(50).optional().or(z.literal('')),
  email: z
    .email({
      error: (issue) =>
        issue.code === 'invalid_type'
          ? 'Email is required'
          : 'patient.validation.invalidEmail',
    })
    .optional()
    .or(z.literal('')),
  phone: z.string().min(7, 'patient.validation.phoneMin').max(20),
  dateOfBirth: z.string().optional().or(z.literal('')),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER']).optional(),
  address: z.string().optional().or(z.literal('')),
  medicalNotes: z.string().optional().or(z.literal('')),
  primaryBranchId: z
    .uuid({
      error: (issue) =>
        issue.code === 'invalid_type'
          ? 'id is required'
          : 'patient.validation.invalidBranchId',
    })
    .optional()
    .or(z.literal('')),
});

export type CreatePatientSchema = z.infer<typeof createPatientSchema>;
