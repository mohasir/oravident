import { Response } from 'express';
import { BaseController } from '@core/shared/BaseController.ts';
import { BranchServicesService } from './branch_services.service.ts';
import { CatchAsync } from '@core/shared/decorators/CatchAsync.ts';
import { branchServiceResource, branchServiceCollectionResource } from './branch_services.resource.ts';
import {
  GetBranchServicesRequest,
  UpsertBranchServiceRequest,
  DeleteBranchServiceRequest,
} from './branch_services.schema.ts';
import { validateRequest } from '@common/utils/request.ts';
import { ApiError, ErrorCodes } from '@core/errors/index.ts';

@CatchAsync
export class BranchServicesController extends BaseController {
  constructor(private branchServicesService: BranchServicesService) {
    super();
  }

  async getOverrides(req: GetBranchServicesRequest, res: Response) {
    const { params } = validateRequest(req);
    const tenantId = this.resolveTenantId(req.tenantId);

    const records = await this.branchServicesService.getOverridesByBranch(
      params.branchId,
      tenantId,
    );

    return this.ok(res, 'Branch service overrides retrieved successfully', branchServiceCollectionResource(records));
  }

  async upsertOverride(req: UpsertBranchServiceRequest, res: Response) {
    const { params, body } = validateRequest(req);
    const tenantId = this.resolveTenantId(req.tenantId);

    if (!tenantId) {
      throw new ApiError('Tenant required', 403, ErrorCodes.auth.FORBIDDEN);
    }

    const record = await this.branchServicesService.upsertOverride(
      params.branchId,
      params.serviceId,
      body,
      tenantId,
    );

    return this.ok(res, 'Branch service override saved successfully', branchServiceResource(record));
  }

  async removeOverride(req: DeleteBranchServiceRequest, res: Response) {
    const { params } = validateRequest(req);
    const tenantId = this.resolveTenantId(req.tenantId);

    await this.branchServicesService.removeOverride(
      params.branchId,
      params.serviceId,
      tenantId,
    );

    return this.noContent(res);
  }
}
