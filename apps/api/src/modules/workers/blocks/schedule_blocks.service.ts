import { ApiError } from '@core/errors/ApiError.ts';
import { ErrorCodes } from '@core/errors/ErrorCodes.ts';
import { ScheduleBlocksRepository } from './schedule_blocks.repository.ts';
import { WorkersRepository } from '@modules/workers/workers.repository.ts';
import { CreateScheduleBlockDTO, UpdateScheduleBlockDTO } from './schedule_blocks.schema.ts';

export class ScheduleBlocksService {
  constructor(
    private scheduleBlocksRepository: ScheduleBlocksRepository,
    private workersRepository: WorkersRepository,
  ) {}

  async getBlocksByWorker(workerId: string, clinicId: string | null) {
    await this.resolveWorker(workerId, clinicId);
    const { data } = await this.scheduleBlocksRepository.findAll({ workerId });
    return data;
  }

  async createBlock(workerId: string, data: CreateScheduleBlockDTO, clinicId: string) {
    await this.resolveWorker(workerId, clinicId);

    const block = await this.scheduleBlocksRepository.create({
      ...data,
      workerId,
      clinicId,
      startAt: new Date(data.startAt),
      endAt: new Date(data.endAt),
    });

    if (!block) {
      throw new ApiError(
        'An unexpected error occurred while creating the block',
        500,
        ErrorCodes.system.INTERNAL_SERVER_ERROR,
      );
    }

    return block;
  }

  async updateBlock(
    blockId: string,
    workerId: string,
    data: UpdateScheduleBlockDTO,
    clinicId: string | null,
  ) {
    await this.resolveBlock(blockId, workerId, clinicId);

    const { startAt, endAt, ...rest } = data;

    const block = await this.scheduleBlocksRepository.update(blockId, {
      ...rest,
      ...(startAt && { startAt: new Date(startAt) }),
      ...(endAt && { endAt: new Date(endAt) }),
    });

    if (!block) {
      throw new ApiError(
        'An unexpected error occurred while updating the block',
        500,
        ErrorCodes.system.INTERNAL_SERVER_ERROR,
      );
    }

    return block;
  }

  async deleteBlock(blockId: string, workerId: string, clinicId: string | null) {
    await this.resolveBlock(blockId, workerId, clinicId);
    return this.scheduleBlocksRepository.delete(blockId);
  }

  private async resolveWorker(workerId: string, clinicId: string | null) {
    const worker = await this.workersRepository.findOne({
      id: workerId,
      ...(clinicId !== null && { clinicId }),
    });

    if (!worker) {
      throw new ApiError('Worker not found', 404, ErrorCodes.system.NOT_FOUND);
    }

    return worker;
  }

  private async resolveBlock(blockId: string, workerId: string, clinicId: string | null) {
    const block = await this.scheduleBlocksRepository.findOne({
      id: blockId,
      workerId,
      ...(clinicId !== null && { clinicId }),
    });

    if (!block) {
      throw new ApiError('Schedule block not found', 404, ErrorCodes.system.NOT_FOUND);
    }

    return block;
  }
}
