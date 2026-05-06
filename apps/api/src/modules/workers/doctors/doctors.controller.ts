import { Response } from 'express';
import { BaseController } from '@core/shared/BaseController.ts';
import { DoctorsService } from '@modules/workers/doctors/doctors.service.ts';
import { CatchAsync } from '@core/shared/decorators/CatchAsync.ts';
import { workerResource, workerCollectionResource } from '@modules/workers/workers.resource.ts';
import {
  GetDoctorsRequest,
  CreateDoctorRequest,
  UpdateDoctorRequest,
  GetDoctorRequest,
} from '@modules/workers/doctors/doctors.schema.ts';
import { validateRequest } from '@common/utils/request.ts';
import { IdParamRequest } from '@common/types/requests.ts';
import { ApiError, ErrorCodes } from '@core/errors/index.ts';

@CatchAsync
export class DoctorsController extends BaseController {
  constructor(private doctorsService: DoctorsService) {
    super();
  }

  async getDoctors(req: GetDoctorsRequest, res: Response) {
    const { query } = validateRequest(req);
    const tenantId = await this.resolveTenantId(req.tenantId);

    if (!tenantId) {
      throw new ApiError('Tenant required', 403, ErrorCodes.auth.FORBIDDEN);
    }

    const result = await this.doctorsService.getAllDoctors(query, tenantId);
    return this.ok(res, 'Doctors retrieved successfully', {
      ...result,
      items: workerCollectionResource(result.items),
    });
  }

  async getDoctor(req: GetDoctorRequest, res: Response) {
    const { params } = validateRequest(req);
    const tenantId = await this.resolveTenantId(req.tenantId);

    if (!tenantId) {
      throw new ApiError('Tenant required', 403, ErrorCodes.auth.FORBIDDEN);
    }

    const { id } = params;
    const doctor = await this.doctorsService.getDoctorById(id, tenantId);
    return this.ok(
      res,
      'Doctor retrieved successfully',
      workerResource(doctor),
    );
  }

  async createDoctor(req: CreateDoctorRequest, res: Response) {
    const { body } = validateRequest(req);
    const tenantId = await this.resolveTenantId(req.tenantId);

    if (!tenantId) {
      throw new ApiError('Tenant required', 403, ErrorCodes.auth.FORBIDDEN);
    }

    const doctor = await this.doctorsService.createDoctor(body, tenantId);
    return this.created(
      res,
      'Doctor created successfully',
      workerResource(doctor),
    );
  }

  async updateDoctor(req: UpdateDoctorRequest, res: Response) {
    const { params, body } = validateRequest(req);
    const tenantId = await this.resolveTenantId(req.tenantId);

    if (!tenantId) {
      throw new ApiError('Tenant required', 403, ErrorCodes.auth.FORBIDDEN);
    }

    const { id } = params;
    const doctor = await this.doctorsService.updateDoctor(id, body, tenantId);
    return this.ok(res, 'Doctor updated successfully', workerResource(doctor));
  }

  async deleteDoctor(req: IdParamRequest, res: Response) {
    const { params } = validateRequest(req);
    const tenantId = await this.resolveTenantId(req.tenantId);

    if (!tenantId) {
      throw new ApiError('Tenant required', 403, ErrorCodes.auth.FORBIDDEN);
    }

    const { id } = params;
    await this.doctorsService.deleteDoctor(id, tenantId);
    return this.noContent(res);
  }
}
