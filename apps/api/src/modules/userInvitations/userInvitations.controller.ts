import { Response } from 'express';
import { BaseController } from '@/core/shared/BaseController.ts';
import { UserInvitationsService } from '@modules/userInvitations/userInvitations.service.ts';
import { CatchAsync } from '@/core/shared/decorators/CatchAsync.ts';
import {
  SendInvitationRequest,
  ValidateInvitationRequest,
  AcceptInvitationRequest,
} from './userInvitations.schema.ts';
import { validateRequest } from '@/common/utils/request.ts';
import { userInvitationResource } from './userInvitations.resource.ts';

@CatchAsync
export class UserInvitationsController extends BaseController {
  constructor(private userInvitationsService: UserInvitationsService) {
    super();
  }

  async sendInvitation(req: SendInvitationRequest, res: Response) {
    const { body } = validateRequest(req);
    await this.userInvitationsService.sendInvitation(body, req.user!.clinicId!);
    return this.created(res, 'Invitation sent successfully', null);
  }

  async validateInvitation(req: ValidateInvitationRequest, res: Response) {
    const { params } = validateRequest(req);
    const { token } = params;

    const invitation =
      await this.userInvitationsService.validateInvitation(token);

    // invitation is already a raw object from service that looks like a resource,
    // but using the resource function ensures consistency.
    return this.ok(
      res,
      'Invitation is valid',
      userInvitationResource(invitation),
    );
  }

  async acceptInvitation(req: AcceptInvitationRequest, res: Response) {
    const { body, params } = validateRequest(req);
    const { token } = params;
    await this.userInvitationsService.acceptInvitation(token, body);
    return this.ok(res, 'Invitation accepted', null);
  }
}
