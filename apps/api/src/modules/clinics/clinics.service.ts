import { ApiError } from '@/core/errors/ApiError.ts';
import { ErrorCodes } from '@/core/errors/ErrorCodes.ts';
import { ClinicsRepository } from './clinics.repository.ts';

export class ClinicService {

  constructor(
    private clinicsRepository: ClinicsRepository
  ) {}

  async validateTenant(id: string) {
    const exists = await this.clinicsRepository.existsById(id);

    if (!exists) {
      throw new ApiError(
        'Tenant not found or inactive',
        404,
        ErrorCodes.auth.TENANT_NOT_FOUND
      );
    }
  }
}
