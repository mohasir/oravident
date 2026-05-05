import { z } from 'zod';

export const createPatientSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(100),
  secondName: z.string().max(100).optional().or(z.literal('')),
  lastName: z.string().min(1, 'Last name is required').max(100),
  secondLastName: z.string().max(100).optional().or(z.literal('')),
  idNumber: z.string().max(50).optional().or(z.literal('')),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  phone: z.string().min(7, 'Phone number must be at least 7 digits').max(20),
  dateOfBirth: z.string().optional().or(z.literal('')),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER']).optional(),
  address: z.string().optional().or(z.literal('')),
  medicalNotes: z.string().optional().or(z.literal('')),
  primaryBranchId: z.string().uuid('Invalid branch ID').optional().or(z.literal('')),
});

export type CreatePatientSchema = z.infer<typeof createPatientSchema>;
