import jwt, { SignOptions } from 'jsonwebtoken';
import { ENV } from '@core/config/env.ts';
import { PermissionType, RoleType } from '@repo/guards';

export interface PayloadAccessToken {
  id: string;
  email: string;
  role: RoleType;
  permissions: PermissionType[];
  tenantId?: string;
}

interface PayloadRefreshToken {
  id: string,
}

export function signAccessToken(
  payload: PayloadAccessToken, 
  expiresIn: SignOptions['expiresIn']
): string {
  return jwt.sign(payload, ENV.JWT_ACCESS_SECRET, { expiresIn });
}

export function verifyAccessToken(token: string) {
  return jwt.verify(token, ENV.JWT_ACCESS_SECRET) as PayloadAccessToken
}

export function signRefreshToken(
  payload: PayloadRefreshToken, 
  expiresIn: SignOptions['expiresIn']
): string {
  return jwt.sign(payload, ENV.JWT_REFRESH_SECRET, { expiresIn });
}

export function verifyRefreshToken(token: string) {
  return jwt.verify(token, ENV.JWT_REFRESH_SECRET) as PayloadRefreshToken;
}
