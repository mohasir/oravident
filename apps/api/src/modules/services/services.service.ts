import { ServicesRepository } from '@modules/services/services.repository.ts';
import { paginatedResult } from '@common/utils/pagination.ts';
import {
  CreateServiceDTO,
  GetServicesQueryDTO,
  UpdateServiceDTO,
} from '@modules/services/services.schema.ts';
import { ApiError } from '@core/errors/ApiError.ts';
import { ErrorCodes } from '@core/errors/ErrorCodes.ts';

export class ServicesService {
  constructor(private servicesRepository: ServicesRepository) {}

  async create(values: CreateServiceDTO, clinicId: string) {
    const exists = await this.servicesRepository.exists({
      name: values.name,
      clinicId,
    });

    if (exists) {
      throw new ApiError(
        'Service name already exists in this clinic',
        409,
        ErrorCodes.system.ALREADY_EXISTS,
      );
    }

    const result = await this.servicesRepository.create({
      ...values,
      clinicId,
    });

    if (!result) {
      throw new ApiError(
        'An unexpected error occurred while creating the service',
        500,
        ErrorCodes.system.INTERNAL_SERVER_ERROR,
      );
    }

    return result;
  }

  async getServiceById(id: string, clinicId: string | null) {
    const service = await this.servicesRepository.findOne({
      id,
      ...(clinicId && { clinicId }),
    });
    if (!service) {
      throw new ApiError('Service not found', 404, ErrorCodes.system.NOT_FOUND);
    }
    return service;
  }

  async getAllServices(query: GetServicesQueryDTO, clinicId: string | null) {
    const { page, limit, ...filters } = query;
    const pagination = { page, limit };

    if (clinicId) {
      filters.clinicId = clinicId;
    }

    const { data, total } = await this.servicesRepository.findAll(
      filters,
      pagination,
    );
    return paginatedResult(data, total, pagination);
  }

  async updateService(
    id: string,
    data: UpdateServiceDTO,
    clinicId: string | null,
  ) {
    const service = await this.getServiceById(id, clinicId);

    if (data.name && data.name !== service.name) {
      const exists = await this.servicesRepository.exists({
        name: data.name,
        clinicId: service.clinicId,
        excludeId: id,
      });
      if (exists) {
        throw new ApiError(
          'Service name already exists in this clinic',
          409,
          ErrorCodes.system.ALREADY_EXISTS,
        );
      }
    }

    const result = await this.servicesRepository.update(id, data);

    if (!result) {
      throw new ApiError(
        'Service not found or could not be updated',
        404,
        ErrorCodes.system.NOT_FOUND,
      );
    }
    return result;
  }

  async deleteService(id: string, clinicId: string | null) {
    await this.getServiceById(id, clinicId);
    const success = await this.servicesRepository.delete(id);
    if (!success) {
      throw new ApiError('Service not found', 404, ErrorCodes.system.NOT_FOUND);
    }
    return { message: 'Service successfully deactivated' };
  }
}
