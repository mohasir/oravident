import { ApiError } from '@core/errors/ApiError.ts';
import { ErrorCodes } from '@core/errors/ErrorCodes.ts';
import { BranchServicesRepository } from './branch_services.repository.ts';
import { BranchesRepository } from '@modules/branches/branches.repository.ts';
import { ServicesRepository } from '@modules/services/services.repository.ts';
import { UpsertBranchServiceDTO } from './branch_services.schema.ts';

export class BranchServicesService {
  constructor(
    private branchServicesRepository: BranchServicesRepository,
    private branchesRepository: BranchesRepository,
    private servicesRepository: ServicesRepository,
  ) {}

  async getOverridesByBranch(branchId: string, clinicId: string | null) {
    await this.resolveBranch(branchId, clinicId);
    const { data } = await this.branchServicesRepository.findAll({ branchId });
    return data;
  }

  async upsertOverride(
    branchId: string,
    serviceId: string,
    data: UpsertBranchServiceDTO,
    clinicId: string,
  ) {
    const [branch, service] = await Promise.all([
      this.branchesRepository.findOne({ id: branchId, clinicId }),
      this.servicesRepository.findOne({ id: serviceId, clinicId }),
    ]);

    if (!branch) {
      throw new ApiError('Branch not found', 404, ErrorCodes.system.NOT_FOUND);
    }

    if (!service) {
      throw new ApiError('Service not found', 404, ErrorCodes.system.NOT_FOUND);
    }

    return this.branchServicesRepository.upsert({
      branchId,
      serviceId,
      clinicId,
      priceOverride: data.priceOverride ?? null,
      isActive: data.isActive ?? true,
    });
  }

  async removeOverride(branchId: string, serviceId: string, clinicId: string | null) {
    await this.resolveBranch(branchId, clinicId);

    const removed = await this.branchServicesRepository.remove(branchId, serviceId);

    if (!removed) {
      throw new ApiError(
        'No override found for this service in this branch',
        404,
        ErrorCodes.system.NOT_FOUND,
      );
    }
  }

  private async resolveBranch(branchId: string, clinicId: string | null) {
    const branch = await this.branchesRepository.findOne({
      id: branchId,
      ...(clinicId !== null && { clinicId }),
    });

    if (!branch) {
      throw new ApiError('Branch not found', 404, ErrorCodes.system.NOT_FOUND);
    }

    return branch;
  }
}
