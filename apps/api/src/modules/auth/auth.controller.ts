import { Request, Response } from 'express';
import { BaseController } from '@/core/shared/BaseController.ts';
import { AuthService } from '@modules/auth/auth.service.ts';
import { CatchAsync } from '@/core/shared/decorators/CatchAsync.ts';
import { ApiError } from '@/core/errors/ApiError.ts';
import { ErrorCodes } from '@/core/errors/ErrorCodes.ts';

@CatchAsync
export class AuthController extends BaseController {
  constructor(private authService: AuthService) {
    super();
  }

  async login(req: Request, res: Response) {
    const data = req.body;

    const meta = {
      userAgent: req.headers['user-agent'] as string,
      ipAddress: req.ip,
    };

    const tokens = await this.authService.login(data, meta);

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

  async register(req: Request, res: Response) {
    return this.ok(res, 'Register successful', null);
  }

  async forgotPassword(req: Request, res: Response) {
    const data = await this.authService.forgotPassword(req.body);
    return this.ok(
      res,
      'If the email is registered, you will receive a reset link shortly',
      data,
    );
  }

  async resetPassword(req: Request, res: Response) {
    await this.authService.resetPassword(req.body);
    return this.ok(res, 'Password updated successfully', null);
  }

  async changePassword(req: Request, res: Response) {
    return this.ok(res, 'Password changed successfully', null);
  }

  async refreshToken(req: Request, res: Response) {
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
      throw new ApiError('No refresh token', 401, ErrorCodes.auth.UNAUTHORIZED);
    }

    const tokens = await this.authService.refreshToken(refreshToken);

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

  async updateProfile(req: Request, res: Response) {
    return this.ok(res, 'Profile updated', null);
  }
}
