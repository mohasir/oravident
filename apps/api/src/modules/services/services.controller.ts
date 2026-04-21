import { Response } from 'express';
import { BaseController } from '@core/shared/BaseController.ts';
import { ServicesService } from '@modules/services/services.service.ts';
import { CatchAsync } from '@core/shared/decorators/CatchAsync.ts';
import {
  serviceResource,
  serviceCollectionResource,
} from '@modules/services/services.resource.ts';
import {
  CreateServiceRequest,
  GetServicesRequest,
  GetServiceRequest,
  UpdateServiceRequest,
  DeleteServiceRequest,
} from '@modules/services/services.schema.ts';
import { validateRequest } from '@common/utils/request.ts';

@CatchAsync
export class ServicesController extends BaseController {
  constructor(private servicesService: ServicesService) {
    super();
  }

  async createService(req: CreateServiceRequest, res: Response) {
    const { body } = validateRequest(req);
    const result = await this.servicesService.create(body);

    return this.created(
      res,
      'Service created successfully',
      serviceResource(result),
    );
  }

  async getServices(req: GetServicesRequest, res: Response) {
    const { query } = validateRequest(req);

    const result = await this.servicesService.getAllServices(query);

    return this.ok(res, 'Clinics retrieved successfully', {
      ...result,
      items: serviceCollectionResource(result.items),
    });
  }

  async getService(req: GetServiceRequest, res: Response) {
    const { params } = validateRequest(req);
    const { id } = params;

    const result = await this.servicesService.getServiceById(id);

    return this.ok(
      res,
      'Service retrieved successfully',
      serviceResource(result),
    );
  }

  async updateService(req: UpdateServiceRequest, res: Response) {
    const { params, body } = validateRequest(req);
    const { id } = params;

    const result = await this.servicesService.updateService(id, body);

    return this.ok(
      res,
      'Service updated successfully',
      serviceResource(result),
    );
  }

  async deleteService(req: DeleteServiceRequest, res: Response) {
    const { params } = validateRequest(req);
    const { id } = params;

    await this.servicesService.deleteService(id);

    return this.noContent(res);
  }
}
