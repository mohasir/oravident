import { Response } from 'express';
import { BaseController } from '@core/shared/BaseController.ts';
import { BranchesService } from '@modules/branches/branches.service.ts';
import { CatchAsync } from '@core/shared/decorators/CatchAsync.ts';
import {
  branchResource,
  branchCollectionResource,
} from '@modules/branches/branches.resource.ts';
import {
  GetBranchesRequest,
  CreateBranchRequest,
  createBranchSuperadminRequest,
  UpdateBranchRequest,
  GetBranchRequest,
  CreateBranchDTO,
} from '@modules/branches/branches.schema.ts';
import { validateRequest } from '@common/utils/request.ts';
import { IdParamRequest } from '@common/types/requests.ts';
import { ApiError, ErrorCodes } from '@core/errors/index.ts';

@CatchAsync
export class BranchesController extends BaseController {
  constructor(private branchesService: BranchesService) {
    super();
  }

  async createBranch(req: CreateBranchRequest, res: Response) {
    const { body } = validateRequest(req);
    const tenantId = await this.resolveTenantId(req.tenantId);

    return this.handleCreateBranch(res, body, tenantId);
  }

  async createBranchForSuperadmin(
    req: createBranchSuperadminRequest,
    res: Response,
  ) {
    const { body, params } = validateRequest(req);
    return this.handleCreateBranch(res, body, params.clinicId);
  }

  private async handleCreateBranch(
    res: Response,
    body: CreateBranchDTO,
    clinicId?: string | null,
  ) {
    if (!clinicId) {
      throw new ApiError('Tenant required', 403, ErrorCodes.auth.FORBIDDEN);
    }

    const branch = await this.branchesService.createBranch(body, clinicId);
    return this.created(
      res,
      'Branch created successfully',
      branchResource(branch),
    );
  }

  async getBranches(req: GetBranchesRequest, res: Response) {
    const { query } = validateRequest(req);
    const tenantId = await this.resolveTenantId(req.tenantId);

    const result = await this.branchesService.getAllBranches(query, tenantId);
    return this.ok(res, 'Branches retrieved successfully', {
      ...result,
      items: branchCollectionResource(result.items),
    });
  }

  async getBranch(req: GetBranchRequest, res: Response) {
    const { params } = validateRequest(req);
    const tenantId = await this.resolveTenantId(req.tenantId);
    const { id } = params;
    const branch = await this.branchesService.getBranchById(id, tenantId);
    return this.ok(
      res,
      'Branch retrieved successfully',
      branchResource(branch),
    );
  }

  async updateBranch(req: UpdateBranchRequest, res: Response) {
    const { params, body } = validateRequest(req);
    const tenantId = await this.resolveTenantId(req.tenantId);
    const { id } = params;
    const branch = await this.branchesService.updateBranch(id, body, tenantId);
    return this.ok(res, 'Branch updated successfully', branchResource(branch));
  }

  async deleteBranch(req: IdParamRequest, res: Response) {
    const { params } = validateRequest(req);
    const tenantId = await this.resolveTenantId(req.tenantId);
    const { id } = params;
    await this.branchesService.deleteBranch(id, tenantId);
    return this.noContent(res);
  }
}
