import { Request, Response } from 'express';
import { BaseController } from '@/core/shared/BaseController.ts';
import { ClinicsService } from './clinics.service.ts';
import { CatchAsync } from '@/core/shared/decorators/CatchAsync.ts';
import { IdParamRequest } from '@/common/types/requests.ts';

@CatchAsync
export class ClinicsController extends BaseController {
  constructor(private clinicsService: ClinicsService) {
    super();
  }

  async createClinic(req: Request, res: Response) {
    const clinic = await this.clinicsService.createClinic(req.body);
    return this.created(res, 'Clinic created successfully', clinic);
  }

  async getClinic(req: IdParamRequest, res: Response) {
    const { id } = req.params;
    const clinic = await this.clinicsService.getClinicById(id);
    return this.ok(res, 'Clinic retrieved successfully', clinic);
  }
}
