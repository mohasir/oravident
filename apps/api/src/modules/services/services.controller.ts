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
  CreateServiceSuperadminRequest,
  GetServicesRequest,
  GetServiceRequest,
  UpdateServiceRequest,
  DeleteServiceRequest,
  CreateServiceDTO,
} from '@modules/services/services.schema.ts';
import { validateRequest } from '@common/utils/request.ts';
import { ApiError, ErrorCodes } from '@core/errors/index.ts';

@CatchAsync
export class ServicesController extends BaseController {
  constructor(private servicesService: ServicesService) {
    super();
  }

  async createService(req: CreateServiceRequest, res: Response) {
    const { body } = validateRequest(req);
    const tenantId = await this.resolveTenantId(req.tenantId);

    return this.handleCreateService(res, body, tenantId);
  }

  async createServiceForSuperadmin(
    req: CreateServiceSuperadminRequest,
    res: Response,
  ) {
    const { body, params } = validateRequest(req);
    return this.handleCreateService(res, body, params.clinicId);
  }

  private async handleCreateService(
    res: Response,
    body: CreateServiceDTO,
    clinicId?: string | null,
  ) {
    if (!clinicId) {
      throw new ApiError('Tenant required', 403, ErrorCodes.auth.FORBIDDEN);
    }

    const result = await this.servicesService.create(body, clinicId);

    return this.created(
      res,
      'Service created successfully',
      serviceResource(result),
    );
  }

  async getServices(req: GetServicesRequest, res: Response) {
    const { query } = validateRequest(req);
    const tenantId = await this.resolveTenantId(req.tenantId);

    const result = await this.servicesService.getAllServices(query, tenantId);

    return this.ok(res, 'Services retrieved successfully', {
      ...result,
      items: serviceCollectionResource(result.items),
    });
  }

  async getService(req: GetServiceRequest, res: Response) {
    const { params } = validateRequest(req);
    const tenantId = await this.resolveTenantId(req.tenantId);
    const { id } = params;

    const result = await this.servicesService.getServiceById(id, tenantId);

    return this.ok(
      res,
      'Service retrieved successfully',
      serviceResource(result),
    );
  }

  async updateService(req: UpdateServiceRequest, res: Response) {
    const { params, body } = validateRequest(req);
    const tenantId = await this.resolveTenantId(req.tenantId);
    const { id } = params;

    const result = await this.servicesService.updateService(id, body, tenantId);

    return this.ok(
      res,
      'Service updated successfully',
      serviceResource(result),
    );
  }

  async deleteService(req: DeleteServiceRequest, res: Response) {
    const { params } = validateRequest(req);
    const tenantId = await this.resolveTenantId(req.tenantId);
    const { id } = params;

    await this.servicesService.deleteService(id, tenantId);

    return this.noContent(res);
  }
}
