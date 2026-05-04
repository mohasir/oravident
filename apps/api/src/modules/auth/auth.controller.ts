import { Request, Response } from 'express';
import { BaseController } from '@/core/shared/BaseController.ts';
import { AuthService } from '@modules/auth/auth.service.ts';
import { CatchAsync } from '@/core/shared/decorators/CatchAsync.ts';
import { ApiError } from '@/core/errors/ApiError.ts';
import { ErrorCodes } from '@/core/errors/ErrorCodes.ts';
import {
  LoginRequest,
  RegisterRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  ChangePasswordRequest,
  UpdateProfileRequest,
} from './auth.schema.ts';
import { validateRequest } from '@/common/utils/request.ts';

@CatchAsync
export class AuthController extends BaseController {
  constructor(private authService: AuthService) {
    super();
  }

  async login(req: LoginRequest, res: Response) {
    const { body } = validateRequest(req);

    const meta = {
      userAgent: req.headers['user-agent'] as string,
      ipAddress: req.ip,
    };

    const tokens = await this.authService.login(body, meta);

    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return this.ok(res, 'Login successful', {
      accessToken: tokens.accessToken,
    });
  }

  async register(req: RegisterRequest, res: Response) {
    const { body } = validateRequest(req);
    return this.ok(res, 'Register successful', null);
  }

  async forgotPassword(req: ForgotPasswordRequest, res: Response) {
    const { body } = validateRequest(req);
    const result = await this.authService.forgotPassword(body);
    return this.ok(
      res,
      'If the email is registered, you will receive a reset link shortly',
      result,
    );
  }

  async resetPassword(req: ResetPasswordRequest, res: Response) {
    const { body } = validateRequest(req);
    await this.authService.resetPassword(body);
    return this.ok(res, 'Password updated successfully', null);
  }

  async changePassword(req: ChangePasswordRequest, res: Response) {
    const { body } = validateRequest(req);
    return this.ok(res, 'Password changed successfully', null);
  }

  async refreshToken(req: Request, res: Response) {
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
      throw new ApiError('No refresh token', 401, ErrorCodes.auth.UNAUTHORIZED);
    }

    const tokens = await this.authService.refreshToken(refreshToken);

    // Replace old cookie with the new refresh token — old one is already revoked in DB
    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return this.ok(res, 'Token refreshed', {
      accessToken: tokens.accessToken,
    });
  }

  async logout(req: Request, res: Response) {
    const refreshToken = req.cookies?.refreshToken;

    if (refreshToken) {
      await this.authService.logout(refreshToken);
    }

    res.clearCookie('refreshToken');

    return this.ok(res, 'Logged out successfully', null);
  }

  async updateProfile(req: UpdateProfileRequest, res: Response) {
    return this.ok(res, 'Profile updated', null);
  }
}
