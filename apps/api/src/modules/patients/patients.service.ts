import { PatientsRepository } from '@modules/patients/patients.repository.ts';
import { BranchesRepository } from '@modules/branches/branches.repository.ts';
import { paginatedResult } from '@common/utils/pagination.ts';
import {
  CreatePatientDTO,
  GetPatientsQueryDTO,
  UpdatePatientDTO,
} from '@modules/patients/patients.schema.ts';
import { ApiError } from '@core/errors/ApiError.ts';
import { ErrorCodes } from '@core/errors/ErrorCodes.ts';

export class PatientsService {
  constructor(
    private patientsRepository: PatientsRepository,
    private branchesRepository: BranchesRepository,
  ) {}

  async create(values: CreatePatientDTO, clinicId: string) {
    if (values.primaryBranchId) {
      await this.validateBranch(values.primaryBranchId, clinicId);
    }

    if (values.idNumber) {
      const exists = await this.patientsRepository.exists({
        clinicId,
        idNumber: values.idNumber,
      });

      if (exists) {
        throw new ApiError(
          'A patient with this ID number already exists in this clinic',
          409,
          ErrorCodes.system.ALREADY_EXISTS,
        );
      }
    }

    const result = await this.patientsRepository.create({
      ...values,
      clinicId,
    });

    if (!result) {
      throw new ApiError(
        'An unexpected error occurred while creating the patient',
        500,
        ErrorCodes.system.INTERNAL_SERVER_ERROR,
      );
    }

    return result;
  }

  async getPatientById(id: string, tenantId: string | null) {
    const patient = await this.patientsRepository.findOne({
      id,
      ...(tenantId && { clinicId: tenantId }),
    });

    if (!patient) {
      throw new ApiError(
        'Patient not found',
        404,
        ErrorCodes.system.NOT_FOUND,
      );
    }
    return patient;
  }

  async getAllPatients(query: GetPatientsQueryDTO, tenantId: string | null) {
    const { page, limit, ...filters } = query;
    const pagination = { page, limit };

    if (tenantId) {
      filters.clinicId = tenantId;
    }

    const { data, total } = await this.patientsRepository.findAll(
      filters,
      pagination,
    );
    return paginatedResult(data, total, pagination);
  }

  async updatePatient(
    id: string,
    data: UpdatePatientDTO,
    tenantId: string | null,
  ) {
    const patient = await this.getPatientById(id, tenantId);

    if (data.primaryBranchId) {
      await this.validateBranch(data.primaryBranchId, patient.clinicId);
    }

    const result = await this.patientsRepository.update(id, data);

    if (!result) {
      throw new ApiError(
        'An unexpected error occurred while updating the patient',
        500,
        ErrorCodes.system.INTERNAL_SERVER_ERROR,
      );
    }
    return result;
  }

  async deletePatient(id: string, tenantId: string | null) {
    await this.getPatientById(id, tenantId);

    const success = await this.patientsRepository.delete(id);
    if (!success) {
      throw new ApiError(
        'An unexpected error occurred while deleting the patient',
        500,
        ErrorCodes.system.INTERNAL_SERVER_ERROR,
      );
    }
    return { message: 'Patient successfully deactivated' };
  }

  private async validateBranch(branchId: string, clinicId: string) {
    const branch = await this.branchesRepository.findOne({
      id: branchId,
      clinicId,
    });

    if (!branch) {
      throw new ApiError(
        'The specified branch does not exist or does not belong to this clinic',
        400,
        ErrorCodes.validation.VALIDATION_ERROR,
      );
    }
  }
}


