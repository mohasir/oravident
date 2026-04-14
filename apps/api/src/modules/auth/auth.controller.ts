import { Request, Response } from 'express';
import { BaseController } from '@/core/shared/BaseController.ts';
import { AuthService } from './auth.service.ts';
import { CatchAsync } from '@/core/shared/decorators/CatchAsync.ts';

@CatchAsync
export class AuthController extends BaseController {
  
  constructor(private authService: AuthService) {
    super();
  }

  async login(req: Request, res: Response) {
    // TODO: Implement login logic
    return this.ok(res, { message: 'Login successful' });
  }

  async register(req: Request, res: Response) {
    return this.ok(res, { message: 'Register successful' });
  }

  async inviteWorker(req: Request, res: Response) {
    return this.created(res, { message: 'Invitation sent' });
  }

  async acceptInvitation(req: Request, res: Response) {
    return this.ok(res, { message: 'Invitation accepted' });
  }

  async forgotPassword(req: Request, res: Response) {
    return this.ok(res, { message: 'Reset link sent' });
  }

  async resetPassword(req: Request, res: Response) {
    return this.ok(res, { message: 'Password reset successful' });
  }

  async changePassword(req: Request, res: Response) {
    return this.ok(res, { message: 'Password changed successfully' });
  }

  async updateProfile(req: Request, res: Response) {
    return this.ok(res, { message: 'Profile updated' });
  }

  async refreshToken(req: Request, res: Response) {
    return this.ok(res, { message: 'Token refreshed' });
  }
}

const authService = new AuthService();
export const authController = new AuthController(authService);
