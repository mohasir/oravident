import type { NextRequest } from 'next/server';
import { match as matchLocale } from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';
import { i18nConfig } from './config';

export const getLocale = (request: NextRequest): string => {
  const cookieLocale = request.cookies.get(i18nConfig.cookieName)?.value;
  
  if (cookieLocale && (i18nConfig.locales as readonly string[]).includes(cookieLocale)) {
    return cookieLocale;
  }

  const negotiatorHeaders: Record<string, string> = {};
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));

  const languages = new Negotiator({ headers: negotiatorHeaders }).languages();

  if (!languages.length || languages[0] === '*') {
    return i18nConfig.defaultLocale;
  }

  try {
    const locale = matchLocale(
      languages,
      i18nConfig.locales as unknown as string[],
      i18nConfig.defaultLocale
    );
    return locale;
  } catch {
    return i18nConfig.defaultLocale;
  }
};
