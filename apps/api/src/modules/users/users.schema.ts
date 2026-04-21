import { z } from 'zod';
import {
  createIdSchema,
  emailSchema,
  paginationQuerySchema,
} from '@/common/schemas/common.schema.ts';
import { commonIdParamSchema, TypedRequest } from '@common/types/requests.ts';

// ==========================================
// 1. CORE DOMAIN SCHEMAS
// ==========================================

export const createUserSchema = z
  .object({
    email: emailSchema,
    password: z.string().min(8),
    isPlatformAdmin: z.boolean().default(false),
  })
  .strict();

export const updateUserSchema = z
  .object({
    email: emailSchema.optional(),
    isPlatformAdmin: z.boolean().optional(),
    isActive: z.boolean().optional(),
  })
  .strict();

export const userFiltersSchema = z
  .object({
    id: createIdSchema('id').optional(),
    email: emailSchema.optional(),
    isActive: z.boolean().optional(),
  })
  .strict();

export const getUsersQuerySchema = paginationQuerySchema.extend(
  userFiltersSchema.shape,
);

export const workerProfileRowSchema = z.object({
  user: z.object({
    id: z.string(),
    email: emailSchema,
    isSuperadmin: z.boolean(),
    passwordHash: z.string(),
  }),
  worker: z
    .object({
      clinicId: z.string().nullable(),
    })
    .nullable(),
  role: z
    .object({
      id: z.string().nullable(),
      name: z.string().nullable(),
    })
    .nullable(),
  permission: z
    .object({
      id: z.string().nullable(),
      code: z.string().nullable(),
    })
    .nullable(),
});

// ==========================================
// 2. API REQUEST SCHEMAS
// ==========================================

export const createUserRequestSchema = {
  body: createUserSchema,
};

export const getUsersRequestSchema = {
  query: getUsersQuerySchema,
};

export const updateUserRequestSchema = {
  params: commonIdParamSchema.params,
  body: updateUserSchema,
};

export const getUserRequestSchema = {
  params: commonIdParamSchema.params,
};

// ==========================================
// 3. DTOs & DOMAIN TYPES
// ==========================================

export type CreateUserDTO = z.infer<typeof createUserSchema>;
export type UpdateUserDTO = z.infer<typeof updateUserSchema>;
export type UserFiltersDTO = z.infer<typeof userFiltersSchema>;
export type GetUsersQueryDTO = z.infer<typeof getUsersQuerySchema>;
export type WorkerProfileRowDTO = z.infer<typeof workerProfileRowSchema>;

// ==========================================
// 4. TYPED REQUESTS
// ==========================================

export type CreateUserRequest = TypedRequest<typeof createUserRequestSchema>;
export type GetUsersRequest = TypedRequest<typeof getUsersRequestSchema>;
export type UpdateUserRequest = TypedRequest<typeof updateUserRequestSchema>;
export type GetUserRequest = TypedRequest<typeof getUserRequestSchema>;
