import { Response } from 'express';
import { BaseController } from '@/core/shared/BaseController.ts';
import { WorkersService } from './workers.service.ts';
import { CatchAsync } from '@/core/shared/decorators/CatchAsync.ts';
import {
  CreateWorkerRequest,
  GetWorkersRequest,
  UpdateWorkerRequest,
  GetWorkerRequest,
} from './workers.schema.ts';
import { validateRequest } from '@/common/utils/request.ts';
import { IdParamRequest } from '@/common/types/requests.ts';
import {
  workerResource,
  workerCollectionResource,
} from './workers.resource.ts';

@CatchAsync
export class WorkersController extends BaseController {
  constructor(private workersService: WorkersService) {
    super();
  }

  async getWorkers(req: GetWorkersRequest, res: Response) {
    const { query } = validateRequest(req);
    const result = await this.workersService.getAllWorkers(query);
    return this.ok(res, 'Workers retrieved successfully', {
      ...result,
      items: workerCollectionResource(result.items),
    });
  }

  async createWorker(req: CreateWorkerRequest, res: Response) {
    const { body } = validateRequest(req);
    const worker = await this.workersService.createWorker(body);
    return this.created(
      res,
      'Worker created successfully',
      workerResource(worker),
    );
  }

  async getWorker(req: GetWorkerRequest, res: Response) {
    const { params } = validateRequest(req);
    const { id } = params;
    const worker = await this.workersService.getWorkerById(id);
    return this.ok(
      res,
      'Worker retrieved successfully',
      workerResource(worker),
    );
  }

  async updateWorker(req: UpdateWorkerRequest, res: Response) {
    const { params, body } = validateRequest(req);
    const { id } = params;
    const worker = await this.workersService.updateWorker(id, body);
    return this.ok(res, 'Worker updated successfully', workerResource(worker));
  }

  async deactivateWorker(req: IdParamRequest, res: Response) {
    const { params } = validateRequest(req);
    const { id } = params;
    await this.workersService.deactiveWorker(id);
    return this.ok(res, 'Worker deactivated successfully', null);
  }
}
