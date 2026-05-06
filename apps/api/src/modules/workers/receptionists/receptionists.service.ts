import { ApiError } from '@/core/errors/ApiError.ts';
import { ErrorCodes } from '@/core/errors/ErrorCodes.ts';
import { WorkersRepository } from '@modules/workers/workers.repository.ts';
import { RolesRepository } from '@modules/roles/roles.repository.ts';
import { DEMO_IDS } from '@core/db/seeds/fixtures/demo-data.ts';
import { isUUIDInList } from '@/common/utils/uuid.ts';
import { paginatedResult } from '@common/utils/pagination.ts';
import { ROLES } from '@repo/guards';
import {
  CreateReceptionistDTO,
  UpdateReceptionistDTO,
} from '@modules/workers/receptionists/receptionists.schema.ts';
import { GetWorkersQueryDTO } from '@modules/workers/workers.schema.ts';

export class ReceptionistsService {
  constructor(
    private workersRepository: WorkersRepository,
    private rolesRepository: RolesRepository,
  ) {}

  private async getReceptionistRole() {
    const role = await this.rolesRepository.findOne({
      name: ROLES.RECEPTIONIST,
    });
    if (!role) {
      throw new ApiError(
        'Receptionist role not found',
        500,
        ErrorCodes.system.INTERNAL_SERVER_ERROR,
      );
    }
    return role;
  }

  async getAllReceptionists(query: GetWorkersQueryDTO, clinicId: string) {
    const { page, limit, ...filters } = query;
    const pagination = { page, limit };
    const receptionistRole = await this.getReceptionistRole();

    const { data, total } = await this.workersRepository.findAll(
      { ...filters, clinicId, roleId: receptionistRole.id },
      pagination,
    );
    return paginatedResult(data, total, pagination);
  }

  async createReceptionist(data: CreateReceptionistDTO, clinicId: string) {
    const receptionistRole = await this.getReceptionistRole();

    const receptionistExists = await this.workersRepository.exists({
      clinicId,
      userId: data.userId,
    });

    if (receptionistExists) {
      throw new ApiError(
        'Receptionist already exists in this clinic',
        400,
        ErrorCodes.validation.VALIDATION_ERROR,
      );
    }

    const result = await this.workersRepository.create({
      ...data,
      clinicId,
      roleId: receptionistRole.id,
    });

    if (!result) {
      throw new ApiError(
        'An unexpected error occurred while creating the receptionist',
        500,
        ErrorCodes.system.INTERNAL_SERVER_ERROR,
      );
    }

    return result;
  }

  async getReceptionistById(id: string, clinicId: string) {
    const receptionistRole = await this.getReceptionistRole();
    const receptionist = await this.workersRepository.findOne({
      id,
      clinicId,
      roleId: receptionistRole.id,
    });

    if (!receptionist) {
      throw new ApiError(
        'Receptionist not found',
        404,
        ErrorCodes.auth.USER_NOT_FOUND,
      );
    }
    return receptionist;
  }

  async updateReceptionist(
    id: string,
    data: UpdateReceptionistDTO,
    clinicId: string,
  ) {
    await this.getReceptionistById(id, clinicId);

    const result = await this.workersRepository.update(id, data);

    if (!result) {
      throw new ApiError(
        'An unexpected error occurred while updating the receptionist',
        500,
        ErrorCodes.system.INTERNAL_SERVER_ERROR,
      );
    }

    return result;
  }

  async deleteReceptionist(id: string, clinicId: string) {
    if (isUUIDInList(id, [DEMO_IDS.WORKER_RECEPTION])) {
      throw new ApiError(
        'Demo receptionists cannot be deleted.',
        403,
        ErrorCodes.auth.FORBIDDEN,
      );
    }

    await this.getReceptionistById(id, clinicId);
    await this.workersRepository.delete(id);
  }
}
