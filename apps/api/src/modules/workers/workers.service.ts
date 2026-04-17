import { ApiError } from '@/core/errors/ApiError.ts';
import { ErrorCodes } from '@/core/errors/ErrorCodes.ts';
import { WorkersRepository } from './workers.repository.ts';
import { CreateWorkerDTO, UpdateWorkerDTO } from './workers.schema.ts';

export class WorkersService {
  constructor(private workersRepository: WorkersRepository) {}

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

    return this.workersRepository.create(data);
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
    const workerExists = await this.workersRepository.exists({
      id,
    });

    if (!workerExists) {
      throw new ApiError(
        'Worker not found',
        404,
        ErrorCodes.auth.USER_NOT_FOUND,
      );
    }

    return this.workersRepository.update(id, data);
  }

  async getWorkersByClinic(clinicId: string) {
    return this.workersRepository.findByClinicId(clinicId);
  }

  async deactiveWorker(id: string) {
    await this.getWorkerById(id);
    return this.workersRepository.update(id, { isActive: false });
  }
}
