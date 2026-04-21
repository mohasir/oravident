import { Response } from 'express';
import { BaseController } from '@core/shared/BaseController.ts';
import { ClinicsService } from '@modules/clinics/clinics.service.ts';
import { CatchAsync } from '@core/shared/decorators/CatchAsync.ts';
import {
  clinicResource,
  clinicCollectionResource,
} from '@modules/clinics/clinics.resource.ts';
import {
  GetClinicsRequest,
  CreateClinicRequest,
  UpdateClinicRequest,
  GetClinicRequest,
} from '@modules/clinics/clinics.schema.ts';
import { validateRequest } from '@common/utils/request.ts';
import { IdParamRequest } from '@common/types/requests.ts';

@CatchAsync
export class ClinicsController extends BaseController {
  constructor(private clinicsService: ClinicsService) {
    super();
  }

  async createClinic(req: CreateClinicRequest, res: Response) {
    const { body } = validateRequest(req);
    const clinic = await this.clinicsService.createClinic(body);
    return this.created(
      res,
      'Clinic created successfully',
      clinicResource(clinic),
    );
  }

  async getClinics(req: GetClinicsRequest, res: Response) {
    const { query } = validateRequest(req);

    const result = await this.clinicsService.getAllClinics(query);
    return this.ok(res, 'Clinics retrieved successfully', {
      ...result,
      items: clinicCollectionResource(result.items),
    });
  }

  async getClinic(req: GetClinicRequest, res: Response) {
    const { params } = validateRequest(req);
    const { id } = params;
    const clinic = await this.clinicsService.getClinicById(id);
    return this.ok(
      res,
      'Clinic retrieved successfully',
      clinicResource(clinic),
    );
  }

  async updateClinic(req: UpdateClinicRequest, res: Response) {
    const { params, body } = validateRequest(req);
    const { id } = params;
    const clinic = await this.clinicsService.updateClinic(id, body);
    return this.ok(res, 'Clinic updated successfully', clinicResource(clinic));
  }

  async deleteClinic(req: IdParamRequest, res: Response) {
    const { params } = validateRequest(req);
    const { id } = params;
    await this.clinicsService.deleteClinic(id);
    return this.noContent(res);
  }
}
