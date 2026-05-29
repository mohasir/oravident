import { Response } from 'express';
import { BaseController } from '@core/shared/BaseController.ts';
import { ScheduleBlocksService } from './schedule_blocks.service.ts';
import { CatchAsync } from '@core/shared/decorators/CatchAsync.ts';
import { scheduleBlockResource, scheduleBlockCollectionResource } from './schedule_blocks.resource.ts';
import {
  CreateScheduleBlockRequest,
  UpdateScheduleBlockRequest,
  GetScheduleBlocksRequest,
  DeleteScheduleBlockRequest,
} from './schedule_blocks.schema.ts';
import { validateRequest } from '@common/utils/request.ts';
import { ApiError, ErrorCodes } from '@core/errors/index.ts';

@CatchAsync
export class ScheduleBlocksController extends BaseController {
  constructor(private blocksService: ScheduleBlocksService) {
    super();
  }

  async getBlocks(req: GetScheduleBlocksRequest, res: Response) {
    const { params } = validateRequest(req);
    const tenantId = this.resolveTenantId(req.tenantId);

    const blocks = await this.blocksService.getBlocksByWorker(params.workerId, tenantId);

    return this.ok(res, 'Blocks retrieved successfully', scheduleBlockCollectionResource(blocks));
  }

  async createBlock(req: CreateScheduleBlockRequest, res: Response) {
    const { params, body } = validateRequest(req);
    const tenantId = this.resolveTenantId(req.tenantId);

    if (!tenantId) {
      throw new ApiError('Tenant required', 403, ErrorCodes.auth.FORBIDDEN);
    }

    const block = await this.blocksService.createBlock(params.workerId, body, tenantId);

    return this.created(res, 'Block created successfully', scheduleBlockResource(block));
  }

  async updateBlock(req: UpdateScheduleBlockRequest, res: Response) {
    const { params, body } = validateRequest(req);
    const tenantId = this.resolveTenantId(req.tenantId);

    const block = await this.blocksService.updateBlock(
      params.blockId,
      params.workerId,
      body,
      tenantId,
    );

    return this.ok(res, 'Block updated successfully', scheduleBlockResource(block));
  }

  async deleteBlock(req: DeleteScheduleBlockRequest, res: Response) {
    const { params } = validateRequest(req);
    const tenantId = this.resolveTenantId(req.tenantId);

    await this.blocksService.deleteBlock(params.blockId, params.workerId, tenantId);

    return this.noContent(res);
  }
}
