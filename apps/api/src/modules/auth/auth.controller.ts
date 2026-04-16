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
      userAgent: req.headers['user-agent'],
      ipAddress: req.ip,
    }

    const tokens = await this.authService.login(data, meta);

    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return this.ok(res, 'Login successful', {
      accessToken: tokens.accessToken
    });
  }

  async register(req: Request, res: Response) {
    return this.ok(res, 'Register successful', null);
  }

  async inviteWorker(req: Request, res: Response) {
    await this.authService.inviteWorker(req.body, req.user!.clinicId!);

    return this.created(res, 'Invitation sent successfully', null);
  }

  async acceptInvitation(req: Request, res: Response) {
    return this.ok(res, 'Invitation accepted', null);
  }

  async forgotPassword(req: Request, res: Response) {
    return this.ok(res, 'Reset link sent', null);
  }

  async resetPassword(req: Request, res: Response) {
    return this.ok(res, 'Password reset successful', null);
  }

  async changePassword(req: Request, res: Response) {
    return this.ok(res, 'Password changed successfully', null);
  }

  async updateProfile(req: Request, res: Response) {
    return this.ok(res, 'Profile updated', null);
  }

  async refreshToken(req: Request, res: Response) {

    const refreshToken = req.cookies?.refreshToken;

    if(!refreshToken){
      throw new ApiError(
        'No refresh token',
        401,
        ErrorCodes.auth.UNAUTHORIZED
      );
    }

    const tokens = await this.authService.refreshToken(refreshToken);

    return this.ok(res, 'Token refreshed', {
      accessToken: tokens.accessToken
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
}
