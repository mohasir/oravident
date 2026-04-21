import { ApiError } from '@/core/errors/ApiError.ts';
import { ErrorCodes } from '@/core/errors/ErrorCodes.ts';
import { WorkersRepository } from './workers.repository.ts';
import { DEMO_IDS } from '@core/db/seeds/fixtures/demo-data.ts';
import { isUUIDInList } from '@/common/utils/uuid.ts';
import {
  CreateWorkerDTO,
  UpdateWorkerDTO,
  GetWorkersQueryDTO,
} from './workers.schema.ts';

export class WorkersService {
  constructor(private workersRepository: WorkersRepository) {}

  async getAllWorkers(query: GetWorkersQueryDTO) {
    const { page, limit, ...filters } = query;

    const isPaginated = page !== undefined && limit !== undefined;

    const { data, total } = await this.workersRepository.findAll(
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

  async createWorker(data: CreateWorkerDTO) {
    const workerExists = await this.workersRepository.exists({
      clinicId: data.clinicId,
      userId: data.userId,
    });

    if (workerExists) {
      throw new ApiError(
        'Worker already exists in this clinic',
        400,
        ErrorCodes.validation.VALIDATION_ERROR,
      );
    }

    const result = await this.workersRepository.create(data);

    if (!result) {
      throw new ApiError(
        'An unexpected error occurred while creating the worker',
        500,
        ErrorCodes.system.INTERNAL_SERVER_ERROR,
      );
    }

    return result;
  }

  async getWorkerById(id: string) {
    const worker = await this.workersRepository.findOne({ id });
    if (!worker) {
      throw new ApiError(
        'Worker not found',
        404,
        ErrorCodes.auth.USER_NOT_FOUND,
      );
    }
    return worker;
  }

  async updateWorker(id: string, data: UpdateWorkerDTO) {
    const workerExists = await this.workersRepository.exists({ id });
    if (!workerExists) {
      throw new ApiError(
        'Worker not found',
        404,
        ErrorCodes.auth.USER_NOT_FOUND,
      );
    }

    const result = await this.workersRepository.update(id, data);

    if (!result) {
      throw new ApiError(
        'An unexpected error occurred while creating the worker',
        500,
        ErrorCodes.system.INTERNAL_SERVER_ERROR,
      );
    }

    return result;
  }

  async deleteWorker(id: string) {
    const demoWorkerIds = [
      DEMO_IDS.WORKER_ADMIN,
      DEMO_IDS.WORKER_DOCTOR,
      DEMO_IDS.WORKER_RECEPTION,
    ];

    if (isUUIDInList(id, demoWorkerIds)) {
      throw new ApiError(
        'Demo workers cannot be deleted.',
        403,
        ErrorCodes.auth.FORBIDDEN,
      );
    }

    await this.getWorkerById(id);
    await this.workersRepository.delete(id);
  }
}
