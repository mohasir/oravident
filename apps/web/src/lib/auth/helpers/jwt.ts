import { RoleType, PermissionType } from '@repo/guards';

export interface AuthUser {
  id: string;
  email: string;
  role: RoleType;
  permissions: PermissionType[];
  tenantId?: string;
  exp?: number;
  iat?: number;
}

export function decodeAccessToken(token: string): AuthUser | null {
  try {
    const base64Url = token.split('.')[1];
    if (!base64Url) return null;

    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join(''),
    );

    return JSON.parse(jsonPayload) as AuthUser;
  } catch (error) {
    console.error('Failed to decode token:', error);
    return null;
  }
}

export function isTokenExpired(token: string): boolean {
  const decoded = decodeAccessToken(token);
  if (!decoded || !decoded.exp) return true;

  // Agregar un margen de 10 segundos por si hay retraso en red
  return decoded.exp * 1000 < Date.now() + 10000;
}
