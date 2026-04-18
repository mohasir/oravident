import { ApiError } from '@/core/errors/ApiError.ts';
import { ErrorCodes } from '@/core/errors/ErrorCodes.ts';
import { ClinicsRepository } from '@modules/clinics/clinics.repository.ts';
import { generateSlug, randomSuffix } from '@/common/utils/slug.ts';
import {
  CreateClinicDTO,
  UpdateClinicDTO,
  GetClinicsQueryDTO,
} from '@modules/clinics/clinics.schema.ts';
import { Clinic } from './clinics.resource.ts';
import { PaginatedResponse } from '@/common/types/pagination.ts';

export class ClinicsService {
  private maxAttempts = 5;

  constructor(private clinicsRepository: ClinicsRepository) {}

  async createClinic(data: CreateClinicDTO): Promise<Clinic> {
    const emailExists = await this.clinicsRepository.exists({
      email: data.email,
    });

    if (emailExists) {
      throw new ApiError(
        'Clinic with this email already exists',
        400,
        ErrorCodes.validation.VALIDATION_ERROR,
      );
    }

    const slug = await this.resolveUniqueSlug(data.name);
    const result = await this.clinicsRepository.create({ ...data, slug });

    if (!result) {
      throw new ApiError(
        'An unexpected error occurred while creating the clinic',
        500,
        ErrorCodes.system.INTERNAL_SERVER_ERROR,
      );
    }

    return result;
  }

  async getClinicById(id: string): Promise<Clinic> {
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

  async getAllClinics(
    query: GetClinicsQueryDTO,
  ): Promise<PaginatedResponse<Clinic>> {
    const { page, limit, ...filters } = query;

    const { data, total } = await this.clinicsRepository.findMany(filters, {
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

  async updateClinic(id: string, data: UpdateClinicDTO): Promise<Clinic> {
    const clinic = await this.getClinicById(id);
    const updatePayload: UpdateClinicDTO & { slug?: string } = { ...data };

    if (data.name && data.name !== clinic.name) {
      const newSlug = await this.resolveUniqueSlug(data.name, clinic.slug);

      if (newSlug !== clinic.slug) {
        updatePayload.slug = newSlug;
      }
    }

    if (data.email && data.email !== clinic.email) {
      const emailExists = await this.clinicsRepository.exists({
        email: data.email,
      });
      if (emailExists) {
        throw new ApiError(
          'Clinic with this email already exists',
          400,
          ErrorCodes.validation.VALIDATION_ERROR,
        );
      }
    }

    const result = await this.clinicsRepository.update(id, updatePayload);

    if (!result) {
      throw new ApiError(
        'An unexpected error occurred while updating the clinic',
        500,
        ErrorCodes.system.INTERNAL_SERVER_ERROR,
      );
    }

    return result;
  }

  async deleteClinic(id: string) {
    await this.getClinicById(id);
    return this.clinicsRepository.delete(id);
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

  private async resolveUniqueSlug(
    name: string,
    currentSlug?: string,
  ): Promise<string> {
    const baseSlug = generateSlug(name);

    if (currentSlug && baseSlug === currentSlug) {
      return baseSlug;
    }

    let slug = baseSlug;
    let attempts = 0;

    while (attempts < this.maxAttempts) {
      const slugExists = await this.clinicsRepository.exists({ slug });

      if (!slugExists) {
        return slug;
      }

      attempts++;
      slug = `${baseSlug}-${randomSuffix()}`;
    }

    throw new ApiError(
      'Could not generate a unique slug for the clinic',
      500,
      ErrorCodes.system.INTERNAL_SERVER_ERROR,
    );
  }
}
