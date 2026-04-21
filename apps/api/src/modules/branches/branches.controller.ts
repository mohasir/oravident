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
  UpdateBranchRequest,
  GetBranchRequest,
} from '@modules/branches/branches.schema.ts';
import { validateRequest } from '@common/utils/request.ts';
import { IdParamRequest } from '@common/types/requests.ts';

@CatchAsync
export class BranchesController extends BaseController {
  constructor(private branchesService: BranchesService) {
    super();
  }

  async createBranch(req: CreateBranchRequest, res: Response) {
    const { body } = validateRequest(req);
    const branch = await this.branchesService.createBranch(body);
    return this.created(
      res,
      'Branch created successfully',
      branchResource(branch),
    );
  }

  async getBranches(req: GetBranchesRequest, res: Response) {
    const { query } = validateRequest(req);

    const result = await this.branchesService.getAllBranches(query);
    return this.ok(res, 'Branches retrieved successfully', {
      ...result,
      items: branchCollectionResource(result.items),
    });
  }

  async getBranch(req: GetBranchRequest, res: Response) {
    const { params } = validateRequest(req);
    const { id } = params;
    const branch = await this.branchesService.getBranchById(id);
    return this.ok(
      res,
      'Branch retrieved successfully',
      branchResource(branch),
    );
  }

  async updateBranch(req: UpdateBranchRequest, res: Response) {
    const { params, body } = validateRequest(req);
    const { id } = params;
    const branch = await this.branchesService.updateBranch(id, body);
    return this.ok(res, 'Branch updated successfully', branchResource(branch));
  }

  async deleteBranch(req: IdParamRequest, res: Response) {
    const { params } = validateRequest(req);
    const { id } = params;
    await this.branchesService.deleteBranch(id);
    return this.noContent(res);
  }
}
