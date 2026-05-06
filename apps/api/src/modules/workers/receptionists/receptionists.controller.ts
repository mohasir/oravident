import { Response } from 'express';
import { BaseController } from '@core/shared/BaseController.ts';
import { ReceptionistsService } from '@modules/workers/receptionists/receptionists.service.ts';
import { CatchAsync } from '@core/shared/decorators/CatchAsync.ts';
import { workerResource, workerCollectionResource } from '@modules/workers/workers.resource.ts';
import {
  GetReceptionistsRequest,
  CreateReceptionistRequest,
  UpdateReceptionistRequest,
  GetReceptionistRequest,
} from '@modules/workers/receptionists/receptionists.schema.ts';
import { validateRequest } from '@common/utils/request.ts';
import { IdParamRequest } from '@common/types/requests.ts';
import { ApiError, ErrorCodes } from '@core/errors/index.ts';

@CatchAsync
export class ReceptionistsController extends BaseController {
  constructor(private receptionistsService: ReceptionistsService) {
    super();
  }

  async getReceptionists(req: GetReceptionistsRequest, res: Response) {
    const { query } = validateRequest(req);
    const tenantId = await this.resolveTenantId(req.tenantId);

    if (!tenantId) {
      throw new ApiError('Tenant required', 403, ErrorCodes.auth.FORBIDDEN);
    }

    const result = await this.receptionistsService.getAllReceptionists(query, tenantId);
    return this.ok(res, 'Receptionists retrieved successfully', {
      ...result,
      items: workerCollectionResource(result.items),
    });
  }

  async getReceptionist(req: GetReceptionistRequest, res: Response) {
    const { params } = validateRequest(req);
    const tenantId = await this.resolveTenantId(req.tenantId);

    if (!tenantId) {
      throw new ApiError('Tenant required', 403, ErrorCodes.auth.FORBIDDEN);
    }

    const { id } = params;
    const receptionist = await this.receptionistsService.getReceptionistById(id, tenantId);
    return this.ok(
      res,
      'Receptionist retrieved successfully',
      workerResource(receptionist),
    );
  }

  async createReceptionist(req: CreateReceptionistRequest, res: Response) {
    const { body } = validateRequest(req);
    const tenantId = await this.resolveTenantId(req.tenantId);

    if (!tenantId) {
      throw new ApiError('Tenant required', 403, ErrorCodes.auth.FORBIDDEN);
    }

    const receptionist = await this.receptionistsService.createReceptionist(body, tenantId);
    return this.created(
      res,
      'Receptionist created successfully',
      workerResource(receptionist),
    );
  }

  async updateReceptionist(req: UpdateReceptionistRequest, res: Response) {
    const { params, body } = validateRequest(req);
    const tenantId = await this.resolveTenantId(req.tenantId);

    if (!tenantId) {
      throw new ApiError('Tenant required', 403, ErrorCodes.auth.FORBIDDEN);
    }

    const { id } = params;
    const receptionist = await this.receptionistsService.updateReceptionist(id, body, tenantId);
    return this.ok(res, 'Receptionist updated successfully', workerResource(receptionist));
  }

  async deleteReceptionist(req: IdParamRequest, res: Response) {
    const { params } = validateRequest(req);
    const tenantId = await this.resolveTenantId(req.tenantId);

    if (!tenantId) {
      throw new ApiError('Tenant required', 403, ErrorCodes.auth.FORBIDDEN);
    }

    const { id } = params;
    await this.receptionistsService.deleteReceptionist(id, tenantId);
    return this.noContent(res);
  }
}
