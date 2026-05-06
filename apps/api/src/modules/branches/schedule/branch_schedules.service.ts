import { ApiError } from '@core/errors/ApiError.ts';
import { ErrorCodes } from '@core/errors/ErrorCodes.ts';
import { BranchSchedulesRepository } from '@modules/branches/schedule/branch_schedules.repository.ts';
import { BranchesRepository } from '@modules/branches/branches.repository.ts';
import {
  CreateBranchScheduleDTO,
  UpdateBranchScheduleDTO,
} from '@modules/branches/schedule/branch_schedules.schema.ts';

export class BranchSchedulesService {
  constructor(
    private schedulesRepository: BranchSchedulesRepository,
    private branchesRepository: BranchesRepository,
  ) {}

  async getSchedulesByBranch(branchId: string, clinicId: string | null) {
    await this.resolveBranch(branchId, clinicId);
    const { data } = await this.schedulesRepository.findAll({ branchId });
    return data;
  }

  async createSchedule(
    branchId: string,
    data: CreateBranchScheduleDTO,
    clinicId: string,
  ) {
    await this.resolveBranch(branchId, clinicId);

    const conflict = await this.schedulesRepository.exists({
      branchId,
      dayOfWeek: data.dayOfWeek,
    });

    if (conflict) {
      throw new ApiError(
        'A schedule for this day already exists in this branch',
        409,
        ErrorCodes.validation.VALIDATION_ERROR,
      );
    }

    const schedule = await this.schedulesRepository.create({
      ...data,
      branchId,
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
    branchId: string,
    data: UpdateBranchScheduleDTO,
    clinicId: string | null,
  ) {
    await this.resolveSchedule(scheduleId, branchId, clinicId);

    const schedule = await this.schedulesRepository.update(scheduleId, data);

    if (!schedule) {
      throw new ApiError(
        'An unexpected error occurred while updating the schedule',
        500,
        ErrorCodes.system.INTERNAL_SERVER_ERROR,
      );
    }

    return schedule;
  }

  async deleteSchedule(
    scheduleId: string,
    branchId: string,
    clinicId: string | null,
  ) {
    await this.resolveSchedule(scheduleId, branchId, clinicId);
    return this.schedulesRepository.delete(scheduleId);
  }

  private async resolveBranch(branchId: string, clinicId: string | null) {
    const branch = await this.branchesRepository.findOne({
      id: branchId,
      ...(clinicId !== null && { clinicId }),
    });

    if (!branch) {
      throw new ApiError(
        'Branch not found',
        404,
        ErrorCodes.auth.TENANT_NOT_FOUND,
      );
    }

    return branch;
  }

  private async resolveSchedule(
    scheduleId: string,
    branchId: string,
    clinicId: string | null,
  ) {
    const schedule = await this.schedulesRepository.findOne({
      id: scheduleId,
      branchId,
      ...(clinicId !== null && { clinicId }),
    });

    if (!schedule) {
      throw new ApiError(
        'Schedule not found',
        404,
        ErrorCodes.system.NOT_FOUND,
      );
    }

    return schedule;
  }
}
