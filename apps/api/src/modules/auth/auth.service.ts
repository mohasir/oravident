import crypto from 'crypto';
import { ApiError } from '@/core/errors/ApiError.ts';
import { ErrorCodes } from '@/core/errors/ErrorCodes.ts';
import { UserRepository } from '@modules/users/users.repository.ts';
import { UserInvitationsRepository } from '@modules/auth/userInvitations.repository.ts';
import { InviteWorkerDTO, LoginDTO, SessionMetaDTO } from '@modules/auth/auth.schema.ts'; 
import { RolesRepository } from '@modules/roles/roles.repository.ts';
import bcrypt from 'bcryptjs';
import { UserSessionsRepository } from '@modules/auth/userSessions.repository.ts';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '@/common/utils/jwt.ts';
import { hashToken } from '@/common/utils/hash.ts';
import { PermissionType, RoleType } from '@repo/guards';

export class AuthService {

  constructor(
    private userRepository: UserRepository,
    private roleRepository: RolesRepository,
    private userSessionsRepository: UserSessionsRepository,
    private userInvitationsRepository: UserInvitationsRepository,
  ) {}

  async login(data: LoginDTO, meta: SessionMetaDTO) {

    // verify if user exist
    const result = await this.userRepository.findActiveUserWorkerByEmail(data.email);

    
    if (!result) {
      throw new ApiError(
        'Email or password incorrect',
        404,
        ErrorCodes.auth.EMAIL_OR_PASSWORD_INCORRECT
      );
    }

    const {user, worker, role, permissions} = result;
    
    // verify password
    const passwordVerified = await bcrypt.compare(data.password, user.passwordHash);

    if (!passwordVerified) {
      throw new ApiError(
        'Email or password incorrect',
        400,
        ErrorCodes.auth.EMAIL_OR_PASSWORD_INCORRECT
      );
    }

    const accessToken = signAccessToken({
      id: user.id,
      email: user.email,
      role: role?.name as RoleType,
      permissions: permissions as PermissionType[],
      tenantId: worker?.clinicId || undefined,
    }, '30m');

    const refreshToken = signRefreshToken({
      id: user.id
    }, '7d');

    const hashedToken = hashToken(refreshToken);
    const expiresAt = new Date();

    expiresAt.setDate(expiresAt.getDate() + 7);

    // create session
    await this.userSessionsRepository.create({
      userId: user.id,
      token: hashedToken,
      userAgent: meta.userAgent,
      ipAddress: meta.ipAddress,
      expiresAt,
    });

    return {
      accessToken,
      refreshToken
    }


  }

  async refreshToken(refreshToken: string) {

    const payloadJWT = verifyRefreshToken(refreshToken);

    const hashedToken = hashToken(refreshToken);
    const session = await this.userSessionsRepository.findByToken(hashedToken);

    if(!session){
      throw new ApiError(
        'Session expired or revoked',
        401,
        ErrorCodes.auth.INVALID_TOKEN
      );
    }

    const result = await this.userRepository.findActiveUserWorkerById(payloadJWT.id);

    if(!result){
      throw new ApiError(
        'User not found',
        404,
        ErrorCodes.auth.UNAUTHORIZED
      );
    };

    const { user, worker, role, permissions } = result;

    const accessToken = signAccessToken({
      id: user.id,
      email: user.email,
      role: role?.name as RoleType,
      permissions: permissions as PermissionType[],
      tenantId: worker?.clinicId || undefined,
    }, '30m');

    return {accessToken}

  }

  async logout(refreshToken: string) {
    const hashedToken = hashToken(refreshToken);
    await this.userSessionsRepository.revokeByToken(hashedToken);
  }

  async inviteWorker(data: InviteWorkerDTO, clinicId: string) {

    const isValidRole = await this.roleRepository.isValidRoleForClinic(data.roleId, clinicId);

    if(!isValidRole) {
      throw new ApiError(
        'The role does not belong to this clinic or is not available',
        422,
        ErrorCodes.auth.EMAIL_ALREADY_EXISTS
      );
    }

    const userExists = await this.userRepository.existsByEmail(data.email);

    if (userExists) {
      throw new ApiError(
        'User is already registered in the system',
        409,
        ErrorCodes.auth.EMAIL_ALREADY_EXISTS
      );
    }

    const invitationExists = await this.userInvitationsRepository.existsByEmail(data.email);

    if (invitationExists) {
      throw new ApiError(
        'There is already a pending invitation for this email',
        409,
        ErrorCodes.auth.INVITATION_PENDING
      );
    }

    const rawToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = hashToken(rawToken);

    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 48); // add 48 horas

    await this.userInvitationsRepository.create({
      email: data.email,
      roleId: data.roleId,
      token: hashedToken,
      expiresAt: expiresAt,
      clinicId: clinicId
    });
  }
}

