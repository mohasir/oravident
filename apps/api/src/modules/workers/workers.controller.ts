import { Request, Response } from 'express';
import { BaseController } from '@/core/shared/BaseController.ts';
import { WorkersService } from './workers.service.ts';
import { CatchAsync } from '@/core/shared/decorators/CatchAsync.ts';
import { IdParamRequest } from '@/common/types/requests.ts';

@CatchAsync
export class WorkersController extends BaseController {
  constructor(private workersService: WorkersService) {
    super();
  }

  async getClinicWorkers(req: Request, res: Response) {
    const clinicId = req.user?.clinicId;
    if (!clinicId) {
      return this.ok(res, 'Workers list', []);
    }
    const workers = await this.workersService.getWorkersByClinic(clinicId);
    return this.ok(res, 'Workers retrieved successfully', workers);
  }

  async getWorker(req: IdParamRequest, res: Response) {
    const { id } = req.params;
    const worker = await this.workersService.getWorkerById(id);
    return this.ok(res, 'Worker retrieved successfully', worker);
  }

  async updateWorker(req: IdParamRequest, res: Response) {
    const { id } = req.params;
    const worker = await this.workersService.updateWorker(id, req.body);
    return this.ok(res, 'Worker updated successfully', worker);
  }

  async deactivateWorker(req: IdParamRequest, res: Response) {
    const { id } = req.params;
    await this.workersService.deactiveWorker(id);
    return this.ok(res, 'Worker deactivated successfully', null);
  }
}
