import { Response } from 'express';
import { BaseController } from '@/core/shared/BaseController.ts';
import { RolesService } from './roles.service.ts';
import { CatchAsync } from '@/core/shared/decorators/CatchAsync.ts';
import {
  CreateRoleRequest,
  GetRolesRequest,
  UpdateRoleRequest,
  GetRoleRequest,
} from './roles.schema.ts';
import { validateRequest } from '@/common/utils/request.ts';
import { IdParamRequest } from '@/common/types/requests.ts';
import { roleResource, roleCollectionResource } from './roles.resource.ts';

@CatchAsync
export class RolesController extends BaseController {
  constructor(private rolesService: RolesService) {
    super();
  }

  async getRoles(req: GetRolesRequest, res: Response) {
    const { query } = validateRequest(req);
    const result = await this.rolesService.getAllRoles(query);
    return this.ok(res, 'Roles retrieved successfully', {
      ...result,
      items: roleCollectionResource(result.items),
    });
  }

  async createRole(req: CreateRoleRequest, res: Response) {
    const { body } = validateRequest(req);
    const role = await this.rolesService.createRole(body);
    return this.created(res, 'Role created successfully', roleResource(role));
  }

  async getRole(req: GetRoleRequest, res: Response) {
    const { params } = validateRequest(req);
    const { id } = params;
    const role = await this.rolesService.getRoleById(id);
    return this.ok(res, 'Role retrieved successfully', roleResource(role));
  }

  async updateRole(req: UpdateRoleRequest, res: Response) {
    const { params, body } = validateRequest(req);
    const { id } = params;
    const role = await this.rolesService.updateRole(id, body);
    return this.ok(res, 'Role updated successfully', roleResource(role));
  }

  async deleteRole(req: IdParamRequest, res: Response) {
    const { params } = validateRequest(req);
    const { id } = params;
    await this.rolesService.deleteRole(id);
    return this.noContent(res);
  }
}
