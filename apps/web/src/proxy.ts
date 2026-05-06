import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { i18nConfig } from '@/lib/i18n/config';
import { getLocale } from '@/lib/i18n/middleware.locale';
import {
  DEFAULT_REDIRECT_LOGIN,
  DEFAULT_REDIRECT_HOME,
} from '@/lib/auth/navigation';
import {
  middlewareGuards,
  createAbsoluteUrl,
} from '@/lib/auth/middleware.guards';

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const locale = getLocale(request);
  const response = NextResponse.next();

  // Set locale cookie

  response.headers.set('x-next-locale', locale);

  if (request.cookies.get(i18nConfig.cookieName)?.value !== locale) {
    response.cookies.set(i18nConfig.cookieName, locale, {
      path: '/',
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    });
  }

  // Auth guards

  const hasSession = request.cookies.has('refreshToken');

  const guards = middlewareGuards(hasSession, pathname);
  const origin = request.nextUrl.origin;
  const homeUrl = createAbsoluteUrl(origin, DEFAULT_REDIRECT_HOME);

  if (guards.shouldRedirectToLogin()) {
    const loginUrl = createAbsoluteUrl(origin, DEFAULT_REDIRECT_LOGIN);
    const callbackPath = pathname + request.nextUrl.search;

    loginUrl.search = `?callbackUrl=${callbackPath}`;

    return NextResponse.redirect(loginUrl);
  }

  if (guards.shouldRedirectToHome()) {
    return NextResponse.redirect(homeUrl);
  }

  return response;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
