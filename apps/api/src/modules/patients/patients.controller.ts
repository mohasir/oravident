import { Response } from 'express';
import { BaseController } from '@core/shared/BaseController.ts';
import { PatientsService } from '@modules/patients/patients.service.ts';
import { CatchAsync } from '@core/shared/decorators/CatchAsync.ts';
import {
  patientResource,
  patientCollectionResource,
} from '@modules/patients/patients.resource.ts';
import {
  CreatePatientRequest,
  CreatePatientSuperadminRequest,
  GetPatientsRequest,
  GetPatientRequest,
  UpdatePatientRequest,
  DeletePatientRequest,
  CreatePatientDTO,
} from '@modules/patients/patients.schema.ts';
import { validateRequest } from '@common/utils/request.ts';
import { ApiError, ErrorCodes } from '@core/errors/index.ts';

@CatchAsync
export class PatientsController extends BaseController {
  constructor(private patientsService: PatientsService) {
    super();
  }

  async createPatient(req: CreatePatientRequest, res: Response) {
    const { body } = validateRequest(req);
    const tenantId = await this.resolveTenantId(req.tenantId);

    return this.handleCreatePatient(res, body, tenantId);
  }

  async createPatientForSuperadmin(
    req: CreatePatientSuperadminRequest,
    res: Response,
  ) {
    const { body, params } = validateRequest(req);
    return this.handleCreatePatient(res, body, params.clinicId);
  }

  private async handleCreatePatient(
    res: Response,
    body: CreatePatientDTO,
    clinicId?: string | null,
  ) {
    if (!clinicId) {
      throw new ApiError('Tenant required', 403, ErrorCodes.auth.FORBIDDEN);
    }

    const result = await this.patientsService.create(body, clinicId);

    return this.created(
      res,
      'Patient created successfully',
      patientResource(result),
    );
  }

  async getPatients(req: GetPatientsRequest, res: Response) {
    const { query } = validateRequest(req);
    const tenantId = await this.resolveTenantId(req.tenantId);

    const result = await this.patientsService.getAllPatients(query, tenantId);

    return this.ok(res, 'Patients retrieved successfully', {
      ...result,
      items: patientCollectionResource(result.items),
    });
  }

  async getPatient(req: GetPatientRequest, res: Response) {
    const { params } = validateRequest(req);
    const tenantId = await this.resolveTenantId(req.tenantId);
    const { id } = params;

    const result = await this.patientsService.getPatientById(id, tenantId);

    return this.ok(
      res,
      'Patient retrieved successfully',
      patientResource(result),
    );
  }

  async updatePatient(req: UpdatePatientRequest, res: Response) {
    const { params, body } = validateRequest(req);
    const tenantId = await this.resolveTenantId(req.tenantId);
    const { id } = params;

    const result = await this.patientsService.updatePatient(id, body, tenantId);

    return this.ok(
      res,
      'Patient updated successfully',
      patientResource(result),
    );
  }

  async deletePatient(req: DeletePatientRequest, res: Response) {
    const { params } = validateRequest(req);
    const tenantId = await this.resolveTenantId(req.tenantId);
    const { id } = params;

    await this.patientsService.deletePatient(id, tenantId);

    return this.noContent(res);
  }
}

