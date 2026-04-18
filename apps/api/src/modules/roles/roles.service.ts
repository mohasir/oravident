import { ApiError } from '@/core/errors/ApiError.ts';
import { ErrorCodes } from '@/core/errors/ErrorCodes.ts';
import { RolesRepository } from './roles.repository.ts';
import {
  CreateRoleDTO,
  UpdateRoleDTO,
  GetRolesQueryDTO,
} from './roles.schema.ts';
import { PaginatedResponse } from '@/common/types/pagination.ts';
import { Role } from './roles.resource.ts';

export class RolesService {
  constructor(private rolesRepository: RolesRepository) {}

  async getAllRoles(query: GetRolesQueryDTO): Promise<PaginatedResponse<Role>> {
    const { page, limit, ...filters } = query;

    const { data, total } = await this.rolesRepository.findMany(filters, {
      page,
      limit,
    });

    return {
      items: data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async createRole(data: CreateRoleDTO): Promise<Role> {
    const roleExists = await this.rolesRepository.exists({
      name: data.name,
      clinicId: data.clinicId || null,
    });

    if (roleExists) {
      throw new ApiError(
        'A role with this name already exists',
        400,
        ErrorCodes.validation.VALIDATION_ERROR,
      );
    }

    const result = await this.rolesRepository.create({
      ...data,
      isSystem: false,
    });

    if (!result) {
      throw new ApiError(
        'An unexpected error occurred while creating the role',
        500,
        ErrorCodes.system.INTERNAL_SERVER_ERROR,
      );
    }

    return result;
  }

  async getRoleById(id: string): Promise<Role> {
    const role = await this.rolesRepository.findOne({ id });
    if (!role) {
      throw new ApiError('Role not found', 404, ErrorCodes.auth.USER_NOT_FOUND);
    }
    return role;
  }

  async updateRole(id: string, data: UpdateRoleDTO): Promise<Role> {
    const role = await this.getRoleById(id);

    if (role.isSystem) {
      throw new ApiError(
        'System roles cannot be modified',
        403,
        ErrorCodes.auth.UNAUTHORIZED,
      );
    }

    const result = await this.rolesRepository.update(id, data);

    if (!result) {
      throw new ApiError(
        'An unexpected error occurred while updating the role',
        500,
        ErrorCodes.system.INTERNAL_SERVER_ERROR,
      );
    }

    return result;
  }

  async deleteRole(id: string): Promise<void> {
    const role = await this.getRoleById(id);

    if (role.isSystem) {
      throw new ApiError(
        'System roles cannot be deleted',
        403,
        ErrorCodes.auth.UNAUTHORIZED,
      );
    }

    await this.rolesRepository.delete(id);
  }
}
