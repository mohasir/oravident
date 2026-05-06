import { Response } from 'express';
import { BaseController } from '@core/shared/BaseController.ts';
import { WorkerSchedulesService } from './worker_schedules.service.ts';
import { CatchAsync } from '@core/shared/decorators/CatchAsync.ts';
import { workerScheduleResource, workerScheduleCollectionResource } from './worker_schedules.resource.ts';
import {
  CreateWorkerScheduleRequest,
  UpdateWorkerScheduleRequest,
  GetWorkerSchedulesRequest,
  DeleteWorkerScheduleRequest,
} from './worker_schedules.schema.ts';
import { validateRequest } from '@common/utils/request.ts';
import { ApiError, ErrorCodes } from '@core/errors/index.ts';

@CatchAsync
export class WorkerSchedulesController extends BaseController {
  constructor(private schedulesService: WorkerSchedulesService) {
    super();
  }

  async getSchedules(req: GetWorkerSchedulesRequest, res: Response) {
    const { params } = validateRequest(req);
    const tenantId = this.resolveTenantId(req.tenantId);

    const schedules = await this.schedulesService.getSchedulesByWorker(
      params.workerId,
      tenantId,
    );

    return this.ok(res, 'Schedules retrieved successfully', workerScheduleCollectionResource(schedules));
  }

  async createSchedule(req: CreateWorkerScheduleRequest, res: Response) {
    const { params, body } = validateRequest(req);
    const tenantId = this.resolveTenantId(req.tenantId);

    if (!tenantId) {
      throw new ApiError('Tenant required', 403, ErrorCodes.auth.FORBIDDEN);
    }

    const schedule = await this.schedulesService.createSchedule(params.workerId, body, tenantId);

    return this.created(res, 'Schedule created successfully', workerScheduleResource(schedule));
  }

  async updateSchedule(req: UpdateWorkerScheduleRequest, res: Response) {
    const { params, body } = validateRequest(req);
    const tenantId = this.resolveTenantId(req.tenantId);

    const schedule = await this.schedulesService.updateSchedule(
      params.scheduleId,
      params.workerId,
      body,
      tenantId,
    );

    return this.ok(res, 'Schedule updated successfully', workerScheduleResource(schedule));
  }

  async deleteSchedule(req: DeleteWorkerScheduleRequest, res: Response) {
    const { params } = validateRequest(req);
    const tenantId = this.resolveTenantId(req.tenantId);

    await this.schedulesService.deleteSchedule(params.scheduleId, params.workerId, tenantId);

    return this.noContent(res);
  }
}
