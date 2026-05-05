import { AUTH_ROUTES, PROTECTED_ROUTES } from './navigation';

export function middlewareGuards(hasSession: boolean, pathname: string) {
  const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route));
  const isProtectedRoute = PROTECTED_ROUTES.some((route) => pathname.startsWith(route));

  return {
    shouldRedirectToLogin: () => !hasSession && isProtectedRoute,
    shouldRedirectToHome: () => hasSession && isAuthRoute,
  };
}

export function createAbsoluteUrl(origin: string, path: string): URL {
  return new URL(path, origin);
}
