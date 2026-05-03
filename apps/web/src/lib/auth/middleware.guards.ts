import { AUTH_ROUTES, PROTECTED_ROUTES } from './navigation';
import { JWT } from 'next-auth/jwt';

export type UserTokenJWT = JWT | null;

export function middlewareGuards(token: UserTokenJWT, pathname: string) {
  const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route));
  const isProtectedRoute = PROTECTED_ROUTES.some((route) => pathname.startsWith(route));

  return {
    shouldRedirectToLogin: () => !token && isProtectedRoute,
    shouldRedirectToHome: () => 
      pathname === '/' || 
      pathname === '/admin' || 
      pathname === '/admin/' || 
      (!!token && isAuthRoute),
  };
}

export function createAbsoluteUrl(origin: string, path: string): URL {
  return new URL(path, origin);
}
