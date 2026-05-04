import type { NextRequest } from 'next/server';
import { i18nConfig } from './config';

export const getLocale = (request: NextRequest): string => {
  const cookieLocale = request.cookies.get(i18nConfig.cookieName)?.value;

  if (
    cookieLocale &&
    (i18nConfig.locales as readonly string[]).includes(cookieLocale)
  ) {
    return cookieLocale;
  }

  const acceptLanguage = request.headers.get('accept-language');
  if (acceptLanguage) {
    const languages = acceptLanguage
      .split(',')
      .map((lang) => {
        const code = (lang || '').split(';q=')[0];
        if (!code) return '';
        const base = code.trim().split('-')[0];
        return base ? base.toLowerCase() : '';
      })
      .filter((lang) =>
        (i18nConfig.locales as readonly string[]).includes(lang),
      );

    const matched = languages[0];
    if (matched) {
      return matched;
    }
  }

  return i18nConfig.defaultLocale;
};
