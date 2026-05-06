import { Response } from 'express';
import { BaseController } from '@core/shared/BaseController.ts';
import { BranchSchedulesService } from '@modules/branches/schedule/branch_schedules.service.ts';
import { CatchAsync } from '@core/shared/decorators/CatchAsync.ts';
import {
  branchScheduleResource,
  branchScheduleCollectionResource,
} from '@modules/branches/schedule/branch_schedules.resource.ts';
import {
  CreateBranchScheduleRequest,
  UpdateBranchScheduleRequest,
  GetBranchSchedulesRequest,
  DeleteBranchScheduleRequest,
} from '@modules/branches/schedule/branch_schedules.schema.ts';
import { validateRequest } from '@common/utils/request.ts';
import { ApiError, ErrorCodes } from '@core/errors/index.ts';

@CatchAsync
export class BranchSchedulesController extends BaseController {
  constructor(private schedulesService: BranchSchedulesService) {
    super();
  }

  async getSchedules(req: GetBranchSchedulesRequest, res: Response) {
    const { params } = validateRequest(req);
    const tenantId = this.resolveTenantId(req.tenantId);

    const schedules = await this.schedulesService.getSchedulesByBranch(
      params.branchId,
      tenantId,
    );

    return this.ok(
      res,
      'Schedules retrieved successfully',
      branchScheduleCollectionResource(schedules),
    );
  }

  async createSchedule(req: CreateBranchScheduleRequest, res: Response) {
    const { params, body } = validateRequest(req);
    const tenantId = this.resolveTenantId(req.tenantId);

    if (!tenantId) {
      throw new ApiError('Tenant required', 403, ErrorCodes.auth.FORBIDDEN);
    }

    const schedule = await this.schedulesService.createSchedule(
      params.branchId,
      body,
      tenantId,
    );

    return this.created(
      res,
      'Schedule created successfully',
      branchScheduleResource(schedule),
    );
  }

  async updateSchedule(req: UpdateBranchScheduleRequest, res: Response) {
    const { params, body } = validateRequest(req);
    const tenantId = this.resolveTenantId(req.tenantId);

    const schedule = await this.schedulesService.updateSchedule(
      params.scheduleId,
      params.branchId,
      body,
      tenantId,
    );

    return this.ok(
      res,
      'Schedule updated successfully',
      branchScheduleResource(schedule),
    );
  }

  async deleteSchedule(req: DeleteBranchScheduleRequest, res: Response) {
    const { params } = validateRequest(req);
    const tenantId = this.resolveTenantId(req.tenantId);

    await this.schedulesService.deleteSchedule(
      params.scheduleId,
      params.branchId,
      tenantId,
    );

    return this.noContent(res);
  }
}
