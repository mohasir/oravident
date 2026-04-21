import { ApiError } from '@core/errors/ApiError.ts';
import { ErrorCodes } from '@core/errors/ErrorCodes.ts';
import { BranchesRepository } from '@modules/branches/branches.repository.ts';
import { generateSlug, randomSuffix } from '@common/utils/slug.ts';
import { DEMO_IDS } from '@core/db/seeds/fixtures/demo-data.ts';
import { compareUUIDs } from '@/common/utils/uuid.ts';
import {
  CreateBranchDTO,
  UpdateBranchDTO,
  GetBranchesQueryDTO,
} from '@modules/branches/branches.schema.ts';

export class BranchesService {
  private maxAttempts = 5;

  constructor(private branchesRepository: BranchesRepository) {}

  async createBranch(data: CreateBranchDTO) {
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

    const slug = await this.resolveUniqueSlug(data.name);
    const result = await this.branchesRepository.create({ ...data, slug });

    if (!result) {
      throw new ApiError(
        'An unexpected error occurred while creating the branch',
        500,
        ErrorCodes.system.INTERNAL_SERVER_ERROR,
      );
    }

    return result;
  }

  async getBranchById(id: string) {
    const branch = await this.branchesRepository.findOne({ id });
    if (!branch) {
      throw new ApiError(
        'Branch not found',
        404,
        ErrorCodes.auth.TENANT_NOT_FOUND,
      );
    }
    return branch;
  }

  async getAllBranches(query: GetBranchesQueryDTO) {
    const { page, limit, ...filters } = query;

    const isPaginated = page !== undefined && limit !== undefined;

    const { data, total } = await this.branchesRepository.findAll(
      filters,
      isPaginated ? { page, limit } : undefined,
    );

    return {
      items: data,
      ...(isPaginated && {
        meta: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      }),
    };
  }

  async updateBranch(id: string, data: UpdateBranchDTO) {
    const branch = await this.getBranchById(id);
    const updatePayload: UpdateBranchDTO & { slug?: string } = { ...data };

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

    const result = await this.branchesRepository.update(id, updatePayload);

    if (!result) {
      throw new ApiError(
        'An unexpected error occurred while updating the branch',
        500,
        ErrorCodes.system.INTERNAL_SERVER_ERROR,
      );
    }

    return result;
  }

  async deleteBranch(id: string) {
    console.log({ id }, DEMO_IDS.BRANCH);
    if (compareUUIDs(id, DEMO_IDS.BRANCH)) {
      throw new ApiError(
        'The demo branch cannot be deleted.',
        403,
        ErrorCodes.auth.FORBIDDEN,
      );
    }
    await this.getBranchById(id);
    return this.branchesRepository.delete(id);
  }

  async validateTenant(id: string) {
    const exists = await this.branchesRepository.exists({
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
      const slugExists = await this.branchesRepository.exists({ slug });

      if (!slugExists) {
        return slug;
      }

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
