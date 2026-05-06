import { ApiError } from '@/core/errors/ApiError.ts';
import { ErrorCodes } from '@/core/errors/ErrorCodes.ts';
import { WorkersRepository } from '@modules/workers/workers.repository.ts';
import { RolesRepository } from '@modules/roles/roles.repository.ts';
import { DEMO_IDS } from '@core/db/seeds/fixtures/demo-data.ts';
import { isUUIDInList } from '@/common/utils/uuid.ts';
import { paginatedResult } from '@common/utils/pagination.ts';
import { ROLES } from '@repo/guards';
import {
  CreateDoctorDTO,
  UpdateDoctorDTO,
} from '@modules/workers/doctors/doctors.schema.ts';
import { GetWorkersQueryDTO } from '@modules/workers/workers.schema.ts';

export class DoctorsService {
  constructor(
    private workersRepository: WorkersRepository,
    private rolesRepository: RolesRepository,
  ) {}

  private async getDoctorRole() {
    const role = await this.rolesRepository.findOne({ name: ROLES.DOCTOR });
    if (!role) {
      throw new ApiError(
        'Doctor role not found',
        500,
        ErrorCodes.system.INTERNAL_SERVER_ERROR,
      );
    }
    return role;
  }

  async getAllDoctors(query: GetWorkersQueryDTO, clinicId: string) {
    const { page, limit, ...filters } = query;
    const pagination = { page, limit };
    const doctorRole = await this.getDoctorRole();

    const { data, total } = await this.workersRepository.findAll(
      { ...filters, clinicId, roleId: doctorRole.id },
      pagination,
    );
    return paginatedResult(data, total, pagination);
  }

  async createDoctor(data: CreateDoctorDTO, clinicId: string) {
    const doctorRole = await this.getDoctorRole();

    const doctorExists = await this.workersRepository.exists({
      clinicId,
      userId: data.userId,
    });

    if (doctorExists) {
      throw new ApiError(
        'Doctor already exists in this clinic',
        400,
        ErrorCodes.validation.VALIDATION_ERROR,
      );
    }

    const result = await this.workersRepository.create({
      ...data,
      clinicId,
      roleId: doctorRole.id,
    });

    if (!result) {
      throw new ApiError(
        'An unexpected error occurred while creating the doctor',
        500,
        ErrorCodes.system.INTERNAL_SERVER_ERROR,
      );
    }

    return result;
  }

  async getDoctorById(id: string, clinicId: string) {
    const doctorRole = await this.getDoctorRole();
    const doctor = await this.workersRepository.findOne({
      id,
      clinicId,
      roleId: doctorRole.id,
    });

    if (!doctor) {
      throw new ApiError(
        'Doctor not found',
        404,
        ErrorCodes.auth.USER_NOT_FOUND,
      );
    }
    return doctor;
  }

  async updateDoctor(id: string, data: UpdateDoctorDTO, clinicId: string) {
    await this.getDoctorById(id, clinicId);

    const result = await this.workersRepository.update(id, data);

    if (!result) {
      throw new ApiError(
        'An unexpected error occurred while updating the doctor',
        500,
        ErrorCodes.system.INTERNAL_SERVER_ERROR,
      );
    }

    return result;
  }

  async deleteDoctor(id: string, clinicId: string) {
    if (isUUIDInList(id, [DEMO_IDS.WORKER_DOCTOR])) {
      throw new ApiError(
        'Demo doctors cannot be deleted.',
        403,
        ErrorCodes.auth.FORBIDDEN,
      );
    }

    await this.getDoctorById(id, clinicId);
    await this.workersRepository.delete(id);
  }
}
