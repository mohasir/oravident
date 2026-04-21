import { ApiError } from '@/core/errors/ApiError.ts';
import { ErrorCodes } from '@/core/errors/ErrorCodes.ts';
import { UserRepository } from '@modules/users/users.repository.ts';
import {
  CreateUserDTO,
  UpdateUserDTO,
  GetUsersQueryDTO,
} from '@modules/users/users.schema.ts';
import bcrypt from 'bcryptjs';
import { DEMO_IDS } from '@core/db/seeds/fixtures/demo-data.ts';
import { isUUIDInList } from '@/common/utils/uuid.ts';
import { paginatedResult } from '@common/utils/pagination.ts';

export class UsersService {
  constructor(private userRepository: UserRepository) {}

  async createUser(data: CreateUserDTO) {
    const emailExists = await this.userRepository.exists({
      email: data.email,
    });

    if (emailExists) {
      throw new ApiError(
        'User with this email already exists',
        400,
        ErrorCodes.validation.VALIDATION_ERROR,
      );
    }

    const passwordHash = await bcrypt.hash(data.password, 10);

    const result = await this.userRepository.create({
      email: data.email,
      passwordHash,
      isPlatformAdmin: data.isPlatformAdmin,
    });

    if (!result) {
      throw new ApiError(
        'An unexpected error occurred while creating the user',
        500,
        ErrorCodes.system.INTERNAL_SERVER_ERROR,
      );
    }

    const publicUser = await this.userRepository.findPublicOne({
      id: result.id,
    });

    if (!publicUser) {
      throw new ApiError(
        'User created but could not be retrieved',
        500,
        ErrorCodes.system.INTERNAL_SERVER_ERROR,
      );
    }

    return publicUser;
  }

  async getUserById(id: string) {
    const user = await this.userRepository.findPublicOne({ id });
    if (!user) {
      throw new ApiError('User not found', 404, ErrorCodes.auth.USER_NOT_FOUND);
    }
    return user;
  }

  async getAllUsers(query: GetUsersQueryDTO) {
    const { page, limit, ...filters } = query;
    const pagination = { page, limit };
    const { data, total } = await this.userRepository.findPublicAll(filters, pagination);
    return paginatedResult(data, total, pagination);
  }

  async updateUser(id: string, data: UpdateUserDTO) {
    const user = await this.getUserById(id);

    if (data.email && data.email !== user.email) {
      const emailExists = await this.userRepository.exists({
        email: data.email,
      });
      if (emailExists) {
        throw new ApiError(
          'User with this email already exists',
          400,
          ErrorCodes.validation.VALIDATION_ERROR,
        );
      }
    }

    const result = await this.userRepository.update(id, data);

    if (!result) {
      throw new ApiError(
        'An unexpected error occurred while updating the user',
        500,
        ErrorCodes.system.INTERNAL_SERVER_ERROR,
      );
    }

    const publicUser = await this.userRepository.findPublicOne({ id });

    if (!publicUser) {
      throw new ApiError(
        'User updated but could not be retrieved',
        500,
        ErrorCodes.system.INTERNAL_SERVER_ERROR,
      );
    }

    return publicUser;
  }

  async deleteUser(id: string) {
    const demoUserIds = [
      DEMO_IDS.USER_ADMIN,
      DEMO_IDS.USER_DOCTOR,
      DEMO_IDS.USER_RECEPTION,
    ];

    if (isUUIDInList(id, demoUserIds)) {
      throw new ApiError(
        'Demo users cannot be deleted.',
        403,
        ErrorCodes.auth.FORBIDDEN,
      );
    }

    await this.getUserById(id);
    await this.userRepository.delete(id);
  }
}
