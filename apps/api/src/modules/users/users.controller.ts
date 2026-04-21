import { Response } from 'express';
import { BaseController } from '@core/shared/BaseController.ts';
import { UsersService } from '@modules/users/users.service.ts';
import { CatchAsync } from '@core/shared/decorators/CatchAsync.ts';
import {
  userResource,
  userCollectionResource,
} from '@modules/users/users.resource.ts';
import {
  GetUsersRequest,
  CreateUserRequest,
  UpdateUserRequest,
  GetUserRequest,
} from '@modules/users/users.schema.ts';
import { validateRequest } from '@common/utils/request.ts';

@CatchAsync
export class UsersController extends BaseController {
  constructor(private usersService: UsersService) {
    super();
  }

  async createUser(req: CreateUserRequest, res: Response) {
    const { body } = validateRequest(req);
    const user = await this.usersService.createUser(body);
    return this.created(res, 'User created successfully', userResource(user));
  }

  async getAllUsers(req: GetUsersRequest, res: Response) {
    const { query } = validateRequest(req);

    const result = await this.usersService.getAllUsers(query);
    return this.ok(res, 'Users retrieved successfully', {
      ...result,
      items: userCollectionResource(result.items),
    });
  }

  async getUser(req: GetUserRequest, res: Response) {
    const { params } = validateRequest(req);
    const { id } = params;
    const user = await this.usersService.getUserById(id);
    return this.ok(res, 'User retrieved successfully', userResource(user));
  }

  async updateUser(req: UpdateUserRequest, res: Response) {
    const { params, body } = validateRequest(req);
    const { id } = params;
    const user = await this.usersService.updateUser(id, body);
    return this.ok(res, 'User updated successfully', userResource(user));
  }

  async deleteUser(req: GetUserRequest, res: Response) {
    const { params } = validateRequest(req);
    const { id } = params;
    await this.usersService.deleteUser(id);
    return this.noContent(res);
  }
}
