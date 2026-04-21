import { AppointmentsRepository } from '@modules/appointments/appointments.repository.ts';
import { BranchesRepository } from '@modules/branches/branches.repository.ts';
import { WorkersRepository } from '@modules/workers/workers.repository.ts';
import { PatientsRepository } from '@modules/patients/patients.repository.ts';
import { ServicesRepository } from '@modules/services/services.repository.ts';
import { paginatedResult } from '@common/utils/pagination.ts';
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
      serviceId ? this.servicesRepository.findOne({ id: serviceId, clinicId }) : Promise.resolve(null),
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

  async create(values: CreateAppointmentDTO) {
    await this.validateClinicOwnership({
      clinicId: values.clinicId,
      branchId: values.branchId,
      workerId: values.workerId,
      patientId: values.patientId,
      serviceId: values.serviceId,
    });

    const result = await this.appointmentsRepository.create({
      ...values,
      startsAt: new Date(values.startsAt),
      endsAt: new Date(values.endsAt),
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

  async getAppointmentById(id: string) {
    const appointment = await this.appointmentsRepository.findOne({ id });
    if (!appointment) {
      throw new ApiError(
        'Appointment not found',
        404,
        ErrorCodes.system.NOT_FOUND,
      );
    }
    return appointment;
  }

  async getAllAppointments(query: GetAppointmentsQueryDTO) {
    const { page, limit, ...filters } = query;
    const pagination = { page, limit };
    const { data, total } = await this.appointmentsRepository.findAll(
      filters,
      pagination,
    );
    return paginatedResult(data, total, pagination);
  }

  async updateAppointment(id: string, data: UpdateAppointmentDTO) {
    const existing = await this.appointmentsRepository.findOne({ id });
    if (!existing) {
      throw new ApiError(
        'Appointment not found or could not be updated',
        404,
        ErrorCodes.system.NOT_FOUND,
      );
    }

    const needsValidation =
      data.branchId !== undefined ||
      data.workerId !== undefined ||
      data.patientId !== undefined ||
      data.serviceId !== undefined;

    if (needsValidation) {
      await this.validateClinicOwnership({
        clinicId: existing.clinicId,
        branchId: data.branchId ?? existing.branchId,
        workerId: data.workerId ?? existing.workerId,
        patientId: data.patientId ?? existing.patientId,
        serviceId: data.serviceId !== undefined ? data.serviceId : existing.serviceId,
      });
    }

    const { startsAt, endsAt, ...rest } = data;
    const result = await this.appointmentsRepository.update(id, {
      ...rest,
      ...(startsAt !== undefined && { startsAt: new Date(startsAt) }),
      ...(endsAt !== undefined && { endsAt: new Date(endsAt) }),
    });

    if (!result) {
      throw new ApiError(
        'Appointment not found or could not be updated',
        404,
        ErrorCodes.system.NOT_FOUND,
      );
    }
    return result;
  }

  async cancelAppointment(id: string, data: CancelAppointmentDTO) {
    const appointment = await this.appointmentsRepository.findOne({ id });
    if (!appointment) {
      throw new ApiError(
        'Appointment not found',
        404,
        ErrorCodes.system.NOT_FOUND,
      );
    }

    const result = await this.appointmentsRepository.update(id, {
      cancelledAt: new Date(),
      cancelledBy: data.cancelledBy,
      cancelReason: data.cancelReason,
    });

    if (!result) {
      throw new ApiError(
        'Failed to cancel the appointment',
        500,
        ErrorCodes.system.INTERNAL_SERVER_ERROR,
      );
    }
    return result;
  }

  async deleteAppointment(id: string) {
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
