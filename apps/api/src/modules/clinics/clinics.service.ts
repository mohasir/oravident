import { ApiError } from '@/core/errors/ApiError.ts';
import { ErrorCodes } from '@/core/errors/ErrorCodes.ts';
import { ClinicsRepository } from './clinics.repository.ts';
import { CreateClinicDTO } from './clinics.schema.ts';

export class ClinicsService {
  constructor(private clinicsRepository: ClinicsRepository) {}

  async createClinic(data: CreateClinicDTO) {
    const slugExists = await this.clinicsRepository.exists({ slug: data.slug });
    if (slugExists) {
      throw new ApiError(
        'Clinic with this slug already exists',
        400,
        ErrorCodes.common.VALIDATION_ERROR,
      );
    }

    const emailExists = await this.clinicsRepository.exists({
      email: data.email,
    });
    if (emailExists) {
      throw new ApiError(
        'Clinic with this email already exists',
        400,
        ErrorCodes.common.VALIDATION_ERROR,
      );
    }

    return this.clinicsRepository.create(data);
  }

  async getClinicById(id: string) {
    const clinic = await this.clinicsRepository.findOne({ id });
    if (!clinic) {
      throw new ApiError(
        'Clinic not found',
        404,
        ErrorCodes.auth.TENANT_NOT_FOUND,
      );
    }
    return clinic;
  }

  async validateTenant(id: string) {
    const exists = await this.clinicsRepository.exists({
      id,
    });

    if (!exists) {
      throw new ApiError(
        'Tenant not found or inactive',
        404,
        ErrorCodes.auth.TENANT_NOT_FOUND,
      );
    }
  }
}
