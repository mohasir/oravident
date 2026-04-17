import { ApiError } from '@/core/errors/ApiError.ts';
import { ErrorCodes } from '@/core/errors/ErrorCodes.ts';
import { UserInvitationsRepository } from '@modules/userInvitations/userInvitations.repository.ts';
import { AuthRepository } from '@modules/auth/auth.repository.ts';
import { RolesRepository } from '@modules/roles/roles.repository.ts';
import { generateToken, hashToken } from '@/common/utils/hash.ts';
import {
  SendInvitationDTO,
  AcceptInvitationDTO,
} from '@modules/userInvitations/userInvitations.schema.ts';

export class UserInvitationsService {
  constructor(
    private userInvitationsRepository: UserInvitationsRepository,
    private authRepository: AuthRepository,
    private roleRepository: RolesRepository,
  ) {}

  async sendInvitation(data: SendInvitationDTO, clinicId: string) {
    const isValidRole = await this.roleRepository.isValidRoleForClinic(
      data.roleId,
      clinicId,
    );

    if (!isValidRole) {
      throw new ApiError(
        'The role does not belong to this clinic or is not available',
        422,
        ErrorCodes.auth.INVALID_ROLE,
      );
    }

    const userExists = await this.authRepository.userExists({
      email: data.email,
    });

    if (userExists) {
      throw new ApiError(
        'User is already registered in the system',
        409,
        ErrorCodes.auth.EMAIL_ALREADY_EXISTS,
      );
    }

    const invitationExists =
      await this.userInvitationsRepository.hasInvitationActive(data.email);

    if (invitationExists) {
      throw new ApiError(
        'There is already a pending invitation for this email',
        409,
        ErrorCodes.auth.INVITATION_PENDING,
      );
    }

    const rawToken = generateToken();
    const hashedToken = hashToken(rawToken);

    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 48);

    await this.userInvitationsRepository.create({
      email: data.email,
      roleId: data.roleId,
      token: hashedToken,
      expiresAt: expiresAt,
      clinicId: clinicId,
    });

    // TODO: Send email with rawToken
    console.log(`Invitation token for ${data.email}: ${rawToken}`);
  }

  async validateInvitation(token: string) {
    const hashedToken = hashToken(token);
    const invitation = await this.userInvitationsRepository.findOne({
      token: hashedToken,
      isActive: true,
    });

    if (!invitation) {
      throw new ApiError(
        'Invalid or expired invitation token',
        400,
        ErrorCodes.auth.INVALID_TOKEN,
      );
    }

    return {
      email: invitation.email,
      roleId: invitation.roleId,
      clinicId: invitation.clinicId,
    };
  }

  async acceptInvitation(data: AcceptInvitationDTO) {
    // Logic to accept the invitation
  }
}
