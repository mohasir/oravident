import { Response } from 'express';
import { BaseController } from '@core/shared/BaseController.ts';
import { AppointmentsService } from '@modules/appointments/appointments.service.ts';
import { CatchAsync } from '@core/shared/decorators/CatchAsync.ts';
import {
  appointmentResource,
  appointmentWithRelationsResource,
  appointmentWithRelationsCollectionResource,
} from '@modules/appointments/appointments.resource.ts';
import {
  CancelAppointmentRequest,
  CreateAppointmentRequest,
  DeleteAppointmentRequest,
  GetAppointmentRequest,
  GetAppointmentsRequest,
  UpdateAppointmentRequest,
} from '@modules/appointments/appointments.schema.ts';
import { validateRequest } from '@common/utils/request.ts';

@CatchAsync
export class AppointmentsController extends BaseController {
  constructor(private appointmentsService: AppointmentsService) {
    super();
  }

  async createAppointment(req: CreateAppointmentRequest, res: Response) {
    const { body } = validateRequest(req);
    const tenantId = this.resolveTenantId(req.tenantId);

    const result = await this.appointmentsService.create(body, tenantId!);
    return this.created(
      res,
      'Appointment created successfully',
      appointmentResource(result),
    );
  }

  async getAppointments(req: GetAppointmentsRequest, res: Response) {
    const { query } = validateRequest(req);
    const tenantId = this.resolveTenantId(req.tenantId);

    const result = await this.appointmentsService.getAllAppointments(
      query,
      tenantId,
    );
    return this.ok(res, 'Appointments retrieved successfully', {
      ...result,
      items: appointmentWithRelationsCollectionResource(result.items),
    });
  }

  async getAppointment(req: GetAppointmentRequest, res: Response) {
    const { params } = validateRequest(req);
    const tenantId = this.resolveTenantId(req.tenantId);
    const { id } = params;

    const result = await this.appointmentsService.getAppointmentById(
      id,
      tenantId,
    );
    return this.ok(
      res,
      'Appointment retrieved successfully',
      appointmentWithRelationsResource(result),
    );
  }

  async updateAppointment(req: UpdateAppointmentRequest, res: Response) {
    const { params, body } = validateRequest(req);
    const { id } = params;
    const tenantId = this.resolveTenantId(req.tenantId);

    const result = await this.appointmentsService.updateAppointment(
      id,
      body,
      tenantId,
    );
    return this.ok(
      res,
      'Appointment updated successfully',
      appointmentResource(result),
    );
  }

  async cancelAppointment(req: CancelAppointmentRequest, res: Response) {
    const { params, body } = validateRequest(req);
    const { id } = params;
    const tenantId = this.resolveTenantId(req.tenantId);

    const result = await this.appointmentsService.cancelAppointment(
      id,
      body,
      tenantId!,
    );
    return this.ok(
      res,
      'Appointment cancelled successfully',
      appointmentResource(result),
    );
  }

  async deleteAppointment(req: DeleteAppointmentRequest, res: Response) {
    const { params } = validateRequest(req);
    const { id } = params;
    const tenantId = this.resolveTenantId(req.tenantId);

    await this.appointmentsService.deleteAppointment(id, tenantId!);
    return this.noContent(res);
  }
}
