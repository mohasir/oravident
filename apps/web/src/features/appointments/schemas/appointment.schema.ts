import { z } from 'zod';

export const createAppointmentSchema = z.object({
  branchId: z.string().uuid('appointment.validation.branchRequired'),
  patientId: z.string().uuid('appointment.validation.patientRequired'),
  workerId: z.string().uuid('appointment.validation.workerRequired'),
  serviceId: z.string().uuid('appointment.validation.serviceRequired'),
  statusId: z.string().uuid('appointment.validation.statusRequired'),
  startsAt: z.string().min(1, 'appointment.validation.startsAtRequired'),
  endsAt: z.string().min(1, 'appointment.validation.endsAtRequired'),
  notes: z.string().optional().or(z.literal('')),
  price: z.string().regex(/^\d+(\.\d{1,2})?$/, 'appointment.validation.invalidPrice').optional().or(z.literal('')),
});

export type CreateAppointmentSchema = z.infer<typeof createAppointmentSchema>;
