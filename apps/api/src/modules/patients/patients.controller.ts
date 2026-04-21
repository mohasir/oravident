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
  GetPatientsRequest,
  GetPatientRequest,
  UpdatePatientRequest,
  DeletePatientRequest,
} from '@modules/patients/patients.schema.ts';
import { validateRequest } from '@common/utils/request.ts';

@CatchAsync
export class PatientsController extends BaseController {
  constructor(private patientsService: PatientsService) {
    super();
  }

  async createPatient(req: CreatePatientRequest, res: Response) {
    const { body } = validateRequest(req);
    const result = await this.patientsService.create(body);

    return this.created(
      res,
      'Patient created successfully',
      patientResource(result),
    );
  }

  async getPatients(req: GetPatientsRequest, res: Response) {
    const { query } = validateRequest(req);

    const result = await this.patientsService.getAllPatients(query);

    return this.ok(res, 'Patients retrieved successfully', {
      ...result,
      items: patientCollectionResource(result.items),
    });
  }

  async getPatient(req: GetPatientRequest, res: Response) {
    const { params } = validateRequest(req);
    const { id } = params;

    const result = await this.patientsService.getPatientById(id);

    return this.ok(
      res,
      'Patient retrieved successfully',
      patientResource(result),
    );
  }

  async updatePatient(req: UpdatePatientRequest, res: Response) {
    const { params, body } = validateRequest(req);
    const { id } = params;

    const result = await this.patientsService.updatePatient(id, body);

    return this.ok(
      res,
      'Patient updated successfully',
      patientResource(result),
    );
  }

  async deletePatient(req: DeletePatientRequest, res: Response) {
    const { params } = validateRequest(req);
    const { id } = params;

    await this.patientsService.deletePatient(id);

    return this.noContent(res);
  }
}
