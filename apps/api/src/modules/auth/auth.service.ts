import { ApiError } from '@/core/errors/ApiError.ts';
import { ErrorCodes } from '@/core/errors/ErrorCodes.ts';
import { UserRepository } from '@modules/users/users.repository.ts';
import { AuthRepository } from '@modules/auth/auth.repository.ts';
import { UserInvitationsRepository } from '@modules/auth/userInvitations.repository.ts';
import { UserPasswordResetsRepository } from '@modules/auth/userPasswordResets.repository.ts';
import {
  ForgotPasswordDTO,
  InviteWorkerDTO,
  LoginDTO,
  ResetPasswordDTO,
  SessionMetaDTO,
} from '@modules/auth/auth.schema.ts';
import { RolesRepository } from '@modules/roles/roles.repository.ts';
import bcrypt from 'bcryptjs';
import { UserSessionsRepository } from '@modules/auth/userSessions.repository.ts';
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from '@/common/utils/jwt.ts';
import { generateToken, hashToken } from '@/common/utils/hash.ts';
import { PermissionType, RoleType } from '@repo/guards';

export class AuthService {
  constructor(
    private userRepository: UserRepository,
    private authRepository: AuthRepository,
    private roleRepository: RolesRepository,
    private userSessionsRepository: UserSessionsRepository,
    private userInvitationsRepository: UserInvitationsRepository,
    private userPasswordResetsRepository: UserPasswordResetsRepository,
  ) {}

  async login(data: LoginDTO, meta: SessionMetaDTO) {
    // verify if user exist
    const result = await this.authRepository.findUser({
      email: data.email,
    });

    if (!result) {
      throw new ApiError(
        'Invalid email or password',
        401,
        ErrorCodes.auth.EMAIL_OR_PASSWORD_INCORRECT,
      );
    }

    const { user, worker, role, permissions } = result;

    // verify password
    const passwordVerified = await bcrypt.compare(
      data.password,
      user.passwordHash,
    );

    if (!passwordVerified) {
      throw new ApiError(
        'Invalid email or password',
        401,
        ErrorCodes.auth.EMAIL_OR_PASSWORD_INCORRECT,
      );
    }

    const accessToken = signAccessToken(
      {
        id: user.id,
        email: user.email,
        role: role?.name as RoleType,
        permissions: permissions as PermissionType[],
        tenantId: worker?.clinicId || undefined,
      },
      '30m',
    );

    const refreshToken = signRefreshToken(
      {
        id: user.id,
      },
      '7d',
    );

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
      refreshToken,
    };
  }

  async forgotPassword(data: ForgotPasswordDTO) {
    const user = await this.userRepository.findOne({
      email: data.email,
    });

    if (!user) {
      return;
    }

    const token = generateToken();
    const hashedToken = hashToken(token);

    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1);

    await this.userPasswordResetsRepository.create({
      userId: user.id,
      token: hashedToken,
      expiresAt,
    });

    // TODO: Enviar email con el token original (sin hashear)
    console.log(`Reset token for ${data.email}: ${token}`);
  }

  async resetPassword(data: ResetPasswordDTO) {
    const hashedToken = hashToken(data.token);
    const resetRequest =
      await this.userPasswordResetsRepository.findValidToken(hashedToken);

    if (!resetRequest) {
      throw new ApiError(
        'Invalid or expired reset token',
        400,
        ErrorCodes.auth.INVALID_TOKEN,
      );
    }

    const passwordHash = await bcrypt.hash(data.password, 10);

    await this.authRepository.updatePassword(resetRequest.userId, passwordHash);
    await this.userPasswordResetsRepository.markAsUsed(resetRequest.id);

    await this.userSessionsRepository.revokeAllByUserId(resetRequest.userId);
  }

  async refreshToken(refreshToken: string) {
    const payloadJWT = verifyRefreshToken(refreshToken);

    const hashedToken = hashToken(refreshToken);
    const session = await this.userSessionsRepository.findByToken(hashedToken);

    if (!session) {
      throw new ApiError(
        'Session expired or revoked',
        401,
        ErrorCodes.auth.INVALID_TOKEN,
      );
    }

    const result = await this.authRepository.findUser({
      id: payloadJWT.id,
    });

    if (!result) {
      throw new ApiError('User not found', 404, ErrorCodes.auth.UNAUTHORIZED);
    }

    const { user, worker, role, permissions } = result;

    const accessToken = signAccessToken(
      {
        id: user.id,
        email: user.email,
        role: role?.name as RoleType,
        permissions: permissions as PermissionType[],
        tenantId: worker?.clinicId || undefined,
      },
      '30m',
    );

    return { accessToken };
  }

  async logout(refreshToken: string) {
    const hashedToken = hashToken(refreshToken);
    await this.userSessionsRepository.revokeByToken(hashedToken);
  }

  async inviteWorker(data: InviteWorkerDTO, clinicId: string) {
    const isValidRole = await this.roleRepository.isValidRoleForClinic(
      data.roleId,
      clinicId,
    );

    if (!isValidRole) {
      throw new ApiError(
        'The role does not belong to this clinic or is not available',
        422,
        ErrorCodes.auth.EMAIL_ALREADY_EXISTS,
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

    const invitationExists = await this.userInvitationsRepository.existsByEmail(
      data.email,
    );

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
    expiresAt.setHours(expiresAt.getHours() + 48); // add 48 horas

    await this.userInvitationsRepository.create({
      email: data.email,
      roleId: data.roleId,
      token: hashedToken,
      expiresAt: expiresAt,
      clinicId: clinicId,
    });
  }
}
