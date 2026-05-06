import { ApiError } from '@core/errors/ApiError.ts';
import { ErrorCodes } from '@core/errors/ErrorCodes.ts';
import { WorkerSchedulesRepository } from './worker_schedules.repository.ts';
import { WorkersRepository } from '@modules/workers/workers.repository.ts';
import { CreateWorkerScheduleDTO, UpdateWorkerScheduleDTO } from './worker_schedules.schema.ts';

export class WorkerSchedulesService {
  constructor(
    private workerSchedulesRepository: WorkerSchedulesRepository,
    private workersRepository: WorkersRepository,
  ) {}

  async getSchedulesByWorker(workerId: string, clinicId: string | null) {
    await this.resolveWorker(workerId, clinicId);
    const { data } = await this.workerSchedulesRepository.findAll({ workerId });
    return data;
  }

  async createSchedule(workerId: string, data: CreateWorkerScheduleDTO, clinicId: string) {
    await this.resolveWorker(workerId, clinicId);

    const conflict = await this.workerSchedulesRepository.exists({
      workerId,
      branchId: data.branchId,
      dayOfWeek: data.dayOfWeek,
    });

    if (conflict) {
      throw new ApiError(
        'A schedule for this day already exists for this worker at this branch',
        409,
        ErrorCodes.validation.VALIDATION_ERROR,
      );
    }

    const schedule = await this.workerSchedulesRepository.create({
      ...data,
      workerId,
      clinicId,
    });

    if (!schedule) {
      throw new ApiError(
        'An unexpected error occurred while creating the schedule',
        500,
        ErrorCodes.system.INTERNAL_SERVER_ERROR,
      );
    }

    return schedule;
  }

  async updateSchedule(
    scheduleId: string,
    workerId: string,
    data: UpdateWorkerScheduleDTO,
    clinicId: string | null,
  ) {
    await this.resolveSchedule(scheduleId, workerId, clinicId);

    const schedule = await this.workerSchedulesRepository.update(scheduleId, data);

    if (!schedule) {
      throw new ApiError(
        'An unexpected error occurred while updating the schedule',
        500,
        ErrorCodes.system.INTERNAL_SERVER_ERROR,
      );
    }

    return schedule;
  }

  async deleteSchedule(scheduleId: string, workerId: string, clinicId: string | null) {
    await this.resolveSchedule(scheduleId, workerId, clinicId);
    return this.workerSchedulesRepository.delete(scheduleId);
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

  private async resolveSchedule(scheduleId: string, workerId: string, clinicId: string | null) {
    const schedule = await this.workerSchedulesRepository.findOne({
      id: scheduleId,
      workerId,
      ...(clinicId !== null && { clinicId }),
    });

    if (!schedule) {
      throw new ApiError('Schedule not found', 404, ErrorCodes.system.NOT_FOUND);
    }

    return schedule;
  }
}
