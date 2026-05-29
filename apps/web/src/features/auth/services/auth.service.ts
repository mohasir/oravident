import { PUBLIC_API, PROTECTED_API, SECURE_API } from '@/lib/http/api';
import type { LoginSchema } from '@/features/auth/schemas/login.schema';
import type { ForgotPasswordSchema } from '@/features/auth/schemas/forgotPassword.schema';
import type { ResetPasswordSchema } from '@/features/auth/schemas/resetPassword.schema';
import type { ApiResponse } from '@/lib/http/types';
import type { MeProfile, UpdateProfileDTO, LoginResponse } from './types';

export const authService = {
  async login(data: LoginSchema): Promise<LoginResponse> {
    const response = await SECURE_API.post<ApiResponse<LoginResponse>>(
      '/auth/login',
      data,
    );
    return response.data.data;
  },

  async logout(): Promise<void> {
    await SECURE_API.post('/auth/logout');
  },

  async refreshToken() {
    const response = await SECURE_API.post<{ data: { accessToken: string } }>(
      '/auth/refresh',
    );
    return response.data.data.accessToken;
  },

  async getMe(accessToken: string) {
    const response = await PROTECTED_API.get<ApiResponse<MeProfile>>(
      '/auth/me',
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      },
    );
    return response.data;
  },

  async updateProfile(data: UpdateProfileDTO) {
    const response = await PROTECTED_API.put<ApiResponse<MeProfile>>(
      '/auth/profile',
      data,
    );
    return response.data;
  },

  async forgotPassword(data: ForgotPasswordSchema) {
    const response = await PUBLIC_API.post('/auth/forgot-password', data);
    return response.data;
  },

  async resetPassword(data: ResetPasswordSchema & { token: string }) {
    const response = await PUBLIC_API.post('/auth/reset-password', data);
    return response.data;
  },
};
