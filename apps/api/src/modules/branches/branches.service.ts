import { ApiError } from '@core/errors/ApiError.ts';
import { ErrorCodes } from '@core/errors/ErrorCodes.ts';
import { ITransactionManager } from '@core/db/TransactionManager.ts';
import { BranchesRepository } from '@modules/branches/branches.repository.ts';
import { BranchSchedulesRepository } from '@modules/branches/schedule/branch_schedules.repository.ts';
import { generateSlug, randomSuffix } from '@common/utils/slug.ts';
import { DEMO_IDS } from '@core/db/seeds/fixtures/demo-data.ts';
import { compareUUIDs } from '@/common/utils/uuid.ts';
import { paginatedResult } from '@common/utils/pagination.ts';
import {
  CreateBranchDTO,
  UpdateBranchDTO,
  GetBranchesQueryDTO,
} from '@modules/branches/branches.schema.ts';
import { BranchSelect } from '@core/db/schema/branches.ts';
import { BranchScheduleSelect } from '@core/db/schema/branch_schedules.ts';

export type BranchWithSchedules = BranchSelect & {
  schedules: BranchScheduleSelect[];
};

export class BranchesService {
  private maxAttempts = 5;

  constructor(
    private branchesRepository: BranchesRepository,
    private branchSchedulesRepository: BranchSchedulesRepository,
    private transactionManager: ITransactionManager,
  ) {}

  async createBranch(data: CreateBranchDTO, tenantId: string) {
    if (data.email) {
      const emailExists = await this.branchesRepository.exists({
        email: data.email,
      });
      if (emailExists) {
        throw new ApiError(
          'Branch with this email already exists',
          400,
          ErrorCodes.validation.VALIDATION_ERROR,
        );
      }
    }

    const slug = await this.resolveUniqueSlug(data.name);
    const { schedules, ...branchData } = data;

    let branchId: string;

    if (schedules?.length) {
      const created = await this.transactionManager.run(async (tx) => {
        const branchRepo = new BranchesRepository(tx);
        const scheduleRepo = new BranchSchedulesRepository(tx);

        const branch = await branchRepo.create({
          ...branchData,
          clinicId: tenantId,
          slug,
        });

        if (!branch) {
          throw new ApiError(
            'An unexpected error occurred while creating the branch',
            500,
            ErrorCodes.system.INTERNAL_SERVER_ERROR,
          );
        }

        await Promise.all(
          schedules.map((s) =>
            scheduleRepo.create({
              ...s,
              branchId: branch.id,
              clinicId: tenantId,
            }),
          ),
        );

        return branch;
      });

      branchId = created!.id;
    } else {
      const branch = await this.branchesRepository.create({
        ...branchData,
        clinicId: tenantId,
        slug,
      });

      if (!branch) {
        throw new ApiError(
          'An unexpected error occurred while creating the branch',
          500,
          ErrorCodes.system.INTERNAL_SERVER_ERROR,
        );
      }

      branchId = branch.id;
    }

    return this.getBranchById(branchId, tenantId);
  }

  async getBranchById(
    id: string,
    tenantId: string | null,
  ): Promise<BranchWithSchedules> {
    const branch = await this.branchesRepository.findOne({
      id,
      ...(tenantId !== null && { clinicId: tenantId }),
    });

    if (!branch) {
      throw new ApiError(
        'Branch not found',
        404,
        ErrorCodes.auth.TENANT_NOT_FOUND,
      );
    }

    const schedules = await this.branchSchedulesRepository.findAllByBranchIds([
      id,
    ]);

    return { ...branch, schedules };
  }

  async getAllBranches(query: GetBranchesQueryDTO, tenantId: string | null) {
    const { page, limit, ...filters } = query;
    const pagination = { page, limit };

    if (tenantId) {
      filters.clinicId = tenantId;
    }

    const { data, total } = await this.branchesRepository.findAll(
      filters,
      pagination,
    );

    const schedules =
      data.length > 0
        ? await this.branchSchedulesRepository.findAllByBranchIds(
            data.map((b) => b.id),
          )
        : [];

    const items: BranchWithSchedules[] = data.map((branch) => ({
      ...branch,
      schedules: schedules.filter((s) => s.branchId === branch.id),
    }));

    return paginatedResult(items, total, pagination);
  }

  async updateBranch(
    id: string,
    data: UpdateBranchDTO,
    tenantId: string | null,
  ) {
    const branch = await this.getBranchById(id, tenantId);
    const { schedules, ...branchData } = data;
    const updatePayload: UpdateBranchDTO & { slug?: string } = { ...branchData };

    if (data.name && data.name !== branch.name) {
      const newSlug = await this.resolveUniqueSlug(data.name, branch.slug);
      if (newSlug !== branch.slug) {
        updatePayload.slug = newSlug;
      }
    }

    if (data.email && data.email !== branch.email) {
      const emailExists = await this.branchesRepository.exists({
        email: data.email,
      });
      if (emailExists) {
        throw new ApiError(
          'Branch with this email already exists',
          400,
          ErrorCodes.validation.VALIDATION_ERROR,
        );
      }
    }

    if (schedules !== undefined) {
      await this.transactionManager.run(async (tx) => {
        const branchRepo = new BranchesRepository(tx);
        const scheduleRepo = new BranchSchedulesRepository(tx);

        await branchRepo.update(id, updatePayload);

        // Simple sync: delete all and recreate
        await scheduleRepo.deleteByBranchId(id);

        if (schedules.length > 0) {
          await Promise.all(
            schedules.map((s) =>
              scheduleRepo.create({
                ...s,
                branchId: id,
                clinicId: branch.clinicId,
              }),
            ),
          );
        }
      });
    } else {
      const result = await this.branchesRepository.update(id, updatePayload);

      if (!result) {
        throw new ApiError(
          'An unexpected error occurred while updating the branch',
          500,
          ErrorCodes.system.INTERNAL_SERVER_ERROR,
        );
      }
    }

    return this.getBranchById(id, tenantId);
  }

  async deleteBranch(id: string, tenantId: string | null) {
    if (compareUUIDs(id, DEMO_IDS.BRANCH)) {
      throw new ApiError(
        'The demo branch cannot be deleted.',
        403,
        ErrorCodes.auth.FORBIDDEN,
      );
    }
    await this.getBranchById(id, tenantId);
    return this.branchesRepository.delete(id);
  }

  async validateTenant(id: string) {
    const exists = await this.branchesRepository.exists({ id });
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
      const slugExists = await this.branchesRepository.exists({ slug });
      if (!slugExists) return slug;
      attempts++;
      slug = `${baseSlug}-${randomSuffix()}`;
    }

    throw new ApiError(
      'Could not generate a unique slug for the branch',
      500,
      ErrorCodes.system.INTERNAL_SERVER_ERROR,
    );
  }
}
