import { z } from 'zod';
import { DB_LIMITS } from '@/core/db/constants.ts';
import {
  createIdSchema,
  paginationQuerySchema,
} from '@/common/schemas/common.schema.ts';
import { commonIdParamSchema, TypedRequest } from '@/common/types/requests.ts';

// ==========================================
// 1. CORE DOMAIN SCHEMAS
// ==========================================

export const createRoleSchema = z
  .object({
    name: z.string().min(2).max(DB_LIMITS.NAME).trim(),
    displayName: z.string().min(2).max(DB_LIMITS.NAME).trim(),
    description: z.string().max(255).optional().nullable(),
    clinicId: createIdSchema('Clinic').optional().nullable(),
  })
  .strict();

export const updateRoleSchema = createRoleSchema
  .partial()
  .omit({ clinicId: true })
  .strict();

export const roleFiltersSchema = z
  .object({
    id: createIdSchema('id').optional(),
    name: z.string().optional(),
    clinicId: createIdSchema('Clinic').optional().nullable(),
    isSystem: z.boolean().optional(),
    isActive: z.boolean().optional(),
  })
  .strict();

export const getRolesQuerySchema = paginationQuerySchema.extend(
  roleFiltersSchema.shape,
);

// ==========================================
// 2. API REQUEST SCHEMAS
// ==========================================

export const createRoleRequestSchema = {
  body: createRoleSchema,
};

export const getRolesRequestSchema = {
  query: getRolesQuerySchema,
};

export const updateRoleRequestSchema = {
  params: commonIdParamSchema.params,
  body: updateRoleSchema,
};

export const getRoleRequestSchema = {
  params: commonIdParamSchema.params,
};

// ==========================================
// 3. DTOs & DOMAIN TYPES
// ==========================================

export type CreateRoleDTO = z.infer<typeof createRoleSchema>;
export type UpdateRoleDTO = z.infer<typeof updateRoleSchema>;
export type RoleFiltersDTO = z.infer<typeof roleFiltersSchema>;
export type GetRolesQueryDTO = z.infer<typeof getRolesQuerySchema>;

// ==========================================
// 4. TYPED REQUESTS
// ==========================================

export type CreateRoleRequest = TypedRequest<typeof createRoleRequestSchema>;
export type GetRolesRequest = TypedRequest<typeof getRolesRequestSchema>;
export type UpdateRoleRequest = TypedRequest<typeof updateRoleRequestSchema>;
export type GetRoleRequest = TypedRequest<typeof getRoleRequestSchema>;
