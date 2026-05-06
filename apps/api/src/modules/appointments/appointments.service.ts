import { AppointmentsRepository } from '@modules/appointments/appointments.repository.ts';
import { BranchesRepository } from '@modules/branches/branches.repository.ts';
import { WorkersRepository } from '@modules/workers/workers.repository.ts';
import { PatientsRepository } from '@modules/patients/patients.repository.ts';
import { ServicesRepository } from '@modules/services/services.repository.ts';
import { WorkerSchedulesRepository } from '@modules/workers/schedule/worker_schedules.repository.ts';
import { ScheduleBlocksRepository } from '@modules/workers/blocks/schedule_blocks.repository.ts';
import { BranchSchedulesRepository } from '@modules/branches/schedule/branch_schedules.repository.ts';
import { BranchServicesRepository } from '@modules/branches/services/branch_services.repository.ts';
import { paginatedResult } from '@common/utils/pagination.ts';
import { getDayOfWeek, getTimeUTC } from '@common/utils/date.ts';
import {
  CancelAppointmentDTO,
  CreateAppointmentDTO,
  GetAppointmentsQueryDTO,
  UpdateAppointmentDTO,
} from '@modules/appointments/appointments.schema.ts';
import { ApiError } from '@core/errors/ApiError.ts';
import { ErrorCodes } from '@core/errors/ErrorCodes.ts';

export class AppointmentsService {
  constructor(
    private appointmentsRepository: AppointmentsRepository,
    private branchesRepository: BranchesRepository,
    private workersRepository: WorkersRepository,
    private patientsRepository: PatientsRepository,
    private servicesRepository: ServicesRepository,
    private workerSchedulesRepository: WorkerSchedulesRepository,
    private scheduleBlocksRepository: ScheduleBlocksRepository,
    private branchSchedulesRepository: BranchSchedulesRepository,
    private branchServicesRepository: BranchServicesRepository,
  ) {}

  private async validateClinicOwnership(params: {
    clinicId: string;
    branchId: string;
    workerId: string;
    patientId: string;
    serviceId?: string | null;
  }) {
    const { clinicId, branchId, workerId, patientId, serviceId } = params;

    const [branch, worker, patient, service] = await Promise.all([
      this.branchesRepository.findOne({ id: branchId, clinicId }),
      this.workersRepository.findOne({ id: workerId, clinicId }),
      this.patientsRepository.findOne({ id: patientId, clinicId }),
      serviceId
        ? this.servicesRepository.findOne({ id: serviceId, clinicId })
        : Promise.resolve(null),
    ]);

    if (!branch) {
      throw new ApiError(
        'Branch does not belong to the specified clinic',
        409,
        ErrorCodes.system.CONFLICT,
      );
    }
    if (!worker) {
      throw new ApiError(
        'Worker does not belong to the specified clinic',
        409,
        ErrorCodes.system.CONFLICT,
      );
    }
    if (!patient) {
      throw new ApiError(
        'Patient does not belong to the specified clinic',
        409,
        ErrorCodes.system.CONFLICT,
      );
    }
    if (serviceId && !service) {
      throw new ApiError(
        'Service does not belong to the specified clinic',
        409,
        ErrorCodes.system.CONFLICT,
      );
    }
  }

  private async validateTimeSlot(params: {
    startsAt: Date;
    endsAt: Date;
    workerId: string;
    patientId: string;
    excludeId?: string;
  }) {
    const { startsAt, endsAt, workerId, patientId, excludeId } = params;

    const [workerConflicts, patientConflicts] = await Promise.all([
      this.appointmentsRepository.findOverlapping({
        startsAt,
        endsAt,
        workerId,
        excludeId,
      }),
      this.appointmentsRepository.findOverlapping({
        startsAt,
        endsAt,
        patientId,
        excludeId,
      }),
    ]);

    if (workerConflicts.length > 0) {
      throw new ApiError(
        'The worker already has an appointment scheduled in that time slot',
        409,
        ErrorCodes.system.CONFLICT,
      );
    }

    if (patientConflicts.length > 0) {
      throw new ApiError(
        'The patient already has an appointment scheduled in that time slot',
        409,
        ErrorCodes.system.CONFLICT,
      );
    }
  }

  /**
   * Validates worker availability against their configured schedule.
   * If no worker_schedules exist for the given worker+branch pair, falls back
   * to the branch's operating schedule. Absence of a specific day in an otherwise
   * configured schedule means the worker does not work that day.
   *
   * NOTE: Time comparison is done in UTC. Full timezone support requires clinic
   * timezone configuration and should be added when RNF-06 is implemented.
   */
  private async validateWorkerSchedule(
    workerId: string,
    branchId: string,
    startsAt: Date,
    endsAt: Date,
  ) {
    const dayOfWeek = getDayOfWeek(startsAt);
    const startTime = getTimeUTC(startsAt);
    const endTime = getTimeUTC(endsAt);

    const hasWorkerSchedules =
      await this.workerSchedulesRepository.hasSchedulesForWorkerBranch(
        workerId,
        branchId,
      );

    if (hasWorkerSchedules) {
      const schedule = await this.workerSchedulesRepository.findOne({
        workerId,
        branchId,
        dayOfWeek,
      });

      if (!schedule) {
        throw new ApiError(
          'The doctor does not work on this day at the selected branch',
          409,
          ErrorCodes.system.CONFLICT,
        );
      }

      if (startTime < schedule.startTime || endTime > schedule.endTime) {
        throw new ApiError(
          "The appointment is outside the doctor's working hours",
          409,
          ErrorCodes.system.CONFLICT,
        );
      }
    } else {
      // No worker schedule configured — fall back to branch schedule
      const branchSchedule = await this.branchSchedulesRepository.findOne({
        branchId,
        dayOfWeek,
      });

      if (!branchSchedule) {
        throw new ApiError(
          'The branch is not open on this day',
          409,
          ErrorCodes.system.CONFLICT,
        );
      }

      if (
        startTime < branchSchedule.openTime ||
        endTime > branchSchedule.closeTime
      ) {
        throw new ApiError(
          'The appointment is outside the branch operating hours',
          409,
          ErrorCodes.system.CONFLICT,
        );
      }
    }
  }

  private async validateScheduleBlocks(
    workerId: string,
    startsAt: Date,
    endsAt: Date,
  ) {
    const blocks = await this.scheduleBlocksRepository.findOverlapping(
      workerId,
      startsAt,
      endsAt,
    );

    if (blocks.length > 0) {
      throw new ApiError(
        'The doctor has a schedule block during the requested time slot',
        409,
        ErrorCodes.system.CONFLICT,
      );
    }
  }

  private async validateServiceAtBranch(serviceId: string, branchId: string) {
    const available = await this.branchServicesRepository.isServiceAvailable(
      branchId,
      serviceId,
    );

    if (!available) {
      throw new ApiError(
        'This service is not available at the selected branch',
        409,
        ErrorCodes.system.CONFLICT,
      );
    }
  }

  async create(values: CreateAppointmentDTO, clinicId: string) {
    await this.validateClinicOwnership({
      clinicId,
      branchId: values.branchId,
      workerId: values.workerId,
      patientId: values.patientId,
      serviceId: values.serviceId,
    });

    const startsAt = new Date(values.startsAt);
    const endsAt = new Date(values.endsAt);

    await Promise.all([
      this.validateTimeSlot({
        startsAt,
        endsAt,
        workerId: values.workerId,
        patientId: values.patientId,
      }),
      this.validateWorkerSchedule(
        values.workerId,
        values.branchId,
        startsAt,
        endsAt,
      ),
      this.validateScheduleBlocks(values.workerId, startsAt, endsAt),
      ...(values.serviceId
        ? [this.validateServiceAtBranch(values.serviceId, values.branchId)]
        : []),
    ]);

    const result = await this.appointmentsRepository.create({
      ...values,
      startsAt,
      endsAt,
      clinicId,
    });

    if (!result) {
      throw new ApiError(
        'An unexpected error occurred while creating the appointment',
        500,
        ErrorCodes.system.INTERNAL_SERVER_ERROR,
      );
    }

    return result;
  }

  async getAppointmentById(id: string, clinicId: string | null) {
    const result = await this.appointmentsRepository.findOne({
      id,
      ...(clinicId ? { clinicId } : {}),
    });
    if (!result) {
      throw new ApiError(
        'Appointment not found',
        404,
        ErrorCodes.system.NOT_FOUND,
      );
    }
    return result;
  }

  async getAllAppointments(
    query: GetAppointmentsQueryDTO,
    clinicId: string | null,
  ) {
    const { page, limit, ...filters } = query;
    const pagination = { page, limit };

    if (clinicId) {
      filters.clinicId = clinicId;
    }

    const { data, total } = await this.appointmentsRepository.findAll(
      filters,
      pagination,
    );
    return paginatedResult(data, total, pagination);
  }

  async updateAppointment(
    id: string,
    data: UpdateAppointmentDTO,
    clinicId: string | null,
  ) {
    const existing = await this.appointmentsRepository.findOne({
      id,
      ...(clinicId ? { clinicId } : {}),
    });
    if (!existing) {
      throw new ApiError(
        'Appointment not found or could not be updated',
        404,
        ErrorCodes.system.NOT_FOUND,
      );
    }

    const needsOwnershipValidation =
      data.branchId !== undefined ||
      data.workerId !== undefined ||
      data.patientId !== undefined ||
      data.serviceId !== undefined;

    if (needsOwnershipValidation) {
      await this.validateClinicOwnership({
        clinicId: existing.appointment.clinicId,
        branchId: data.branchId ?? existing.appointment.branchId,
        workerId: data.workerId ?? existing.appointment.workerId,
        patientId: data.patientId ?? existing.appointment.patientId,
        serviceId:
          data.serviceId !== undefined
            ? data.serviceId
            : existing.appointment.serviceId,
      });
    }

    const { startsAt, endsAt, ...rest } = data;
    const newStartsAt = startsAt !== undefined ? new Date(startsAt) : undefined;
    const newEndsAt = endsAt !== undefined ? new Date(endsAt) : undefined;

    const resolvedStartsAt = newStartsAt ?? existing.appointment.startsAt;
    const resolvedEndsAt = newEndsAt ?? existing.appointment.endsAt;
    const resolvedWorkerId = data.workerId ?? existing.appointment.workerId;
    const resolvedBranchId = data.branchId ?? existing.appointment.branchId;
    const resolvedPatientId = data.patientId ?? existing.appointment.patientId;
    const resolvedServiceId =
      data.serviceId !== undefined
        ? data.serviceId
        : existing.appointment.serviceId;

    const needsTimeValidation =
      newStartsAt !== undefined ||
      newEndsAt !== undefined ||
      data.workerId !== undefined ||
      data.patientId !== undefined;

    if (needsTimeValidation) {
      await Promise.all([
        this.validateTimeSlot({
          startsAt: resolvedStartsAt,
          endsAt: resolvedEndsAt,
          workerId: resolvedWorkerId,
          patientId: resolvedPatientId,
          excludeId: id,
        }),
        this.validateWorkerSchedule(
          resolvedWorkerId,
          resolvedBranchId,
          resolvedStartsAt,
          resolvedEndsAt,
        ),
        this.validateScheduleBlocks(
          resolvedWorkerId,
          resolvedStartsAt,
          resolvedEndsAt,
        ),
      ]);
    }

    if (data.serviceId !== undefined && resolvedServiceId) {
      await this.validateServiceAtBranch(resolvedServiceId, resolvedBranchId);
    }

    const result = await this.appointmentsRepository.update(
      id,
      {
        ...rest,
        ...(newStartsAt !== undefined && { startsAt: newStartsAt }),
        ...(newEndsAt !== undefined && { endsAt: newEndsAt }),
      },
    );

    if (!result) {
      throw new ApiError(
        'Appointment not found or could not be updated',
        404,
        ErrorCodes.system.NOT_FOUND,
      );
    }
    return result;
  }

  async cancelAppointment(
    id: string,
    data: CancelAppointmentDTO,
    clinicId: string,
  ) {
    const appointment = await this.appointmentsRepository.findOne({ id, clinicId });
    if (!appointment) {
      throw new ApiError(
        'Appointment not found',
        404,
        ErrorCodes.system.NOT_FOUND,
      );
    }

    const result = await this.appointmentsRepository.update(
      id,
      {
        cancelledAt: new Date(),
        cancelledBy: data.cancelledBy,
        cancelReason: data.cancelReason,
      },
    );

    if (!result) {
      throw new ApiError(
        'Failed to cancel the appointment',
        500,
        ErrorCodes.system.INTERNAL_SERVER_ERROR,
      );
    }
    return result;
  }

  async deleteAppointment(id: string, clinicId: string) {
    const existing = await this.appointmentsRepository.findOne({ id, clinicId });
    if (!existing) {
      throw new ApiError(
        'Appointment not found',
        404,
        ErrorCodes.system.NOT_FOUND,
      );
    }

    const success = await this.appointmentsRepository.delete(id);
    if (!success) {
      throw new ApiError(
        'Appointment not found',
        404,
        ErrorCodes.system.NOT_FOUND,
      );
    }
    return { message: 'Appointment successfully deactivated' };
  }
}
