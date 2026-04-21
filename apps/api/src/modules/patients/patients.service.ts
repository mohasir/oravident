import { PatientsRepository } from '@modules/patients/patients.repository.ts';
import { paginatedResult } from '@common/utils/pagination.ts';
import {
  CreatePatientDTO,
  GetPatientsQueryDTO,
  UpdatePatientDTO,
} from '@modules/patients/patients.schema.ts';
import { ApiError } from '@core/errors/ApiError.ts';
import { ErrorCodes } from '@core/errors/ErrorCodes.ts';

export class PatientsService {
  constructor(private patientsRepository: PatientsRepository) {}

  async create(values: CreatePatientDTO) {
    if (values.idNumber) {
      const exists = await this.patientsRepository.exists({
        clinicId: values.clinicId,
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

    const result = await this.patientsRepository.create(values);

    if (!result) {
      throw new ApiError(
        'An unexpected error occurred while creating the patient',
        500,
        ErrorCodes.system.INTERNAL_SERVER_ERROR,
      );
    }

    return result;
  }

  async getPatientById(id: string) {
    const patient = await this.patientsRepository.findOne({ id });
    if (!patient) {
      throw new ApiError(
        'Patient not found',
        404,
        ErrorCodes.system.NOT_FOUND,
      );
    }
    return patient;
  }

  async getAllPatients(query: GetPatientsQueryDTO) {
    const { page, limit, ...filters } = query;
    const pagination = { page, limit };
    const { data, total } = await this.patientsRepository.findAll(filters, pagination);
    return paginatedResult(data, total, pagination);
  }

  async updatePatient(id: string, data: UpdatePatientDTO) {
    const result = await this.patientsRepository.update(id, data);

    if (!result) {
      throw new ApiError(
        'Patient not found or could not be updated',
        404,
        ErrorCodes.system.NOT_FOUND,
      );
    }
    return result;
  }

  async deletePatient(id: string) {
    const success = await this.patientsRepository.delete(id);
    if (!success) {
      throw new ApiError(
        'Patient not found',
        404,
        ErrorCodes.system.NOT_FOUND,
      );
    }
    return { message: 'Patient successfully deactivated' };
  }
}
