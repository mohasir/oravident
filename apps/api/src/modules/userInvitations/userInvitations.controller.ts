import { Request, Response } from 'express';
import { BaseController } from '@/core/shared/BaseController.ts';
import { UserInvitationsService } from '@modules/userInvitations/userInvitations.service.ts';
import { CatchAsync } from '@/core/shared/decorators/CatchAsync.ts';
import { TokenParamRequest, AcceptInvitationRequest } from '@modules/userInvitations/userInvitations.schema.ts';

@CatchAsync
export class UserInvitationsController extends BaseController {
  constructor(private userInvitationsService: UserInvitationsService) {
    super();
  }

  async sendInvitation(req: Request, res: Response) {
    await this.userInvitationsService.sendInvitation(
      req.body,
      req.user!.clinicId!,
    );
    return this.created(res, 'Invitation sent successfully', null);
  }

  async validateInvitation(req: TokenParamRequest, res: Response) {
    const { token } = req.params;

    const invitation = await this.userInvitationsService.validateInvitation(token);
    return this.ok(res, 'Invitation is valid', invitation);
  }

  async acceptInvitation(req: AcceptInvitationRequest, res: Response) {
    const { token } = req.params;
    await this.userInvitationsService.acceptInvitation({ ...req.body, token });
    return this.ok(res, 'Invitation accepted', null);
  }
}
