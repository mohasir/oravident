import { z } from 'zod';

export const scheduleInputSchema = z
  .object({
    days: z
      .array(z.number().int().min(1).max(7))
      .min(1, 'branch.validation.daysRequired'),
    openTime: z
      .string()
      .regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'branch.validation.timeFormat'),
    closeTime: z
      .string()
      .regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'branch.validation.timeFormat'),
  })
  .refine((data) => data.openTime < data.closeTime, {
    message: 'branch.validation.timeRange',
    path: ['closeTime'],
  });

export const createBranchSchema = z
  .object({
    name: z.string().min(2, 'branch.validation.nameMin').max(100),
    address: z.string().min(1, 'branch.validation.addressRequired'),
    email: z
      .union([z.literal(''), z.email('branch.validation.invalidEmail')])
      .optional(),
    phone: z
      .string()
      .max(20, 'branch.validation.phoneMax')
      .optional()
      .or(z.literal('')),
    latitude: z.string().optional().or(z.literal('')),
    longitude: z.string().optional().or(z.literal('')),
    color: z.string().max(7).optional().or(z.literal('')),
    settings: z.record(z.string(), z.unknown()).optional(),
    schedules: z.array(scheduleInputSchema).optional(),
  })
  .transform((data) => ({
    ...data,
    schedules: data.schedules?.flatMap(({ days, openTime, closeTime }) =>
      days.map((dayOfWeek) => ({ dayOfWeek, openTime, closeTime })),
    ),
  }));

export type CreateBranchFormInput = z.input<typeof createBranchSchema>;
export type CreateBranchSchema = z.output<typeof createBranchSchema>;
