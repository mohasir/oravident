import { ApiError } from '@/core/errors/ApiError.ts';
import { ErrorCodes } from '@/core/errors/ErrorCodes.ts';
import { UserRepository } from '@modules/users/users.repository.ts';
import { AuthRepository } from '@modules/auth/auth.repository.ts';
import { UserPasswordResetsRepository } from '@modules/auth/userPasswordResets.repository.ts';
import {
  ForgotPasswordDTO,
  LoginDTO,
  ResetPasswordDTO,
  SessionMetaDTO,
} from '@modules/auth/auth.schema.ts';
import bcrypt from 'bcryptjs';
import { UserSessionsRepository } from '@modules/auth/userSessions.repository.ts';
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from '@/common/utils/jwt.ts';
import { generateToken, hashToken } from '@/common/utils/hash.ts';
import { PermissionType, ROLES, RoleType } from '@repo/guards';
import { ITransactionManager } from '@/core/db/TransactionManager.ts';

export class AuthService {
  constructor(
    private txManager: ITransactionManager,
    private userRepository: UserRepository,
    private authRepository: AuthRepository,
    private userSessionsRepository: UserSessionsRepository,
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

    const roleName = user.isSuperadmin ? ROLES.SUPERADMIN : role?.name;

    if (!roleName) {
      throw new ApiError(
        'Your account does not have an assigned role. Please contact an administrator.',
        403,
        ErrorCodes.auth.FORBIDDEN,
      );
    }

    const accessToken = signAccessToken(
      {
        id: user.id,
        email: user.email,
        role: roleName,
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
    const user = await this.userRepository.findPublicOne({
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

    return {
      token,
    };
  }

  async resetPassword(data: ResetPasswordDTO) {
    const hashedToken = hashToken(data.token);
    const resetRequest = await this.userPasswordResetsRepository.findOne({
      token: hashedToken,
      isValid: true,
    });

    if (!resetRequest) {
      throw new ApiError(
        'Invalid or expired reset token',
        400,
        ErrorCodes.auth.INVALID_TOKEN,
      );
    }

    const newPasswordHash = await bcrypt.hash(data.password, 10);

    await this.txManager.run(async (tx) => {
      await this.authRepository.updatePassword(
        resetRequest.userId,
        newPasswordHash,
        tx,
      );
      await this.userPasswordResetsRepository.markAsUsed(resetRequest.id, tx);
      await this.userSessionsRepository.revokeAllSessionsByUserId(
        resetRequest.userId,
        tx,
      );
    });
  }

  async refreshToken(refreshToken: string) {
    const payloadJWT = verifyRefreshToken(refreshToken);

    const hashedToken = hashToken(refreshToken);
    const session = await this.userSessionsRepository.findOne({
      token: hashedToken,
      isValid: true,
    });

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
}
