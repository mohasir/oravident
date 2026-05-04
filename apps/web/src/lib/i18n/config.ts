export const i18nNamespaces = ['common', 'public', 'admin'];

export const i18nConfig = {
  locales: ['es', 'en'],
  defaultLocale: 'es',
  cookieName: 'NEXT_LOCALE',
} as const;

export type Locale = (typeof i18nConfig)['locales'][number];
