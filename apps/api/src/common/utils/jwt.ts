import jwt, { SignOptions } from 'jsonwebtoken';
import { ENV } from '@core/config/env.ts';
import { PermissionType, RoleType } from '@repo/guards';
import { ApiError, ErrorCodes } from '@/core/errors/index.ts';

export interface PayloadAccessToken {
  id: string;
  email: string;
  role: string;
  permissions: PermissionType[];
  tenantId?: string;
}

interface PayloadRefreshToken {
  id: string;
}

export function signAccessToken(
  payload: PayloadAccessToken,
  expiresIn: SignOptions['expiresIn'],
): string {
  return jwt.sign(payload, ENV.JWT_ACCESS_SECRET, { expiresIn });
}

export function verifyAccessToken(token: string) {
  try {
    return jwt.verify(token, ENV.JWT_ACCESS_SECRET) as PayloadAccessToken;
  } catch (error) {
    throw new ApiError(
      'Invalid or expired access token',
      401,
      ErrorCodes.auth.UNAUTHORIZED,
      { originalError: error },
    );
  }
}

export function signRefreshToken(
  payload: PayloadRefreshToken,
  expiresIn: SignOptions['expiresIn'],
): string {
  return jwt.sign(payload, ENV.JWT_REFRESH_SECRET, { expiresIn });
}

export function verifyRefreshToken(token: string) {
  try {
    return jwt.verify(token, ENV.JWT_REFRESH_SECRET) as PayloadRefreshToken;
  } catch (error) {
    throw new ApiError(
      'Invalid or expired refresh token',
      401,
      ErrorCodes.auth.UNAUTHORIZED,
      { originalError: error },
    );
  }
}
