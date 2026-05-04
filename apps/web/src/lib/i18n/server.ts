import { createInstance, Resource, i18n, TFunction } from 'i18next';
import { initReactI18next } from 'react-i18next/initReactI18next';
import resourcesToBackend from 'i18next-resources-to-backend';
import { cookies } from 'next/headers';
import { i18nConfig, i18nNamespaces } from './config';

export const initI18next = async (locale: string, namespaces: string[]): Promise<i18n> => {
  const i18nInstance = createInstance();

  await i18nInstance
    .use(initReactI18next)
    .use(
      resourcesToBackend(
        (language: string, namespace: string) =>
          import(`@/locales/${language}/${namespace}.json`)
      )
    )
    .init({
      lng: locale,
      fallbackLng: i18nConfig.defaultLocale,
      supportedLngs: i18nConfig.locales,
      defaultNS: namespaces[0],
      fallbackNS: namespaces[0],
      ns: namespaces,
      preload: typeof window === 'undefined' ? [] : [locale],
    });

  return i18nInstance;
};

export async function getTranslation(
  locale: string,
  namespaces: string | string[] = 'common',
  options: { keyPrefix?: string } = {}
): Promise<{ t: TFunction; i18n: i18n }> {
  const i18nextInstance = await initI18next(
    locale,
    Array.isArray(namespaces) ? namespaces : [namespaces]
  );
  return {
    t: i18nextInstance.getFixedT(
      locale,
      Array.isArray(namespaces) ? (namespaces[0] ?? 'common') : (namespaces ?? 'common'),
      options.keyPrefix
    ),
    i18n: i18nextInstance,
  };
}

export async function getI18nResources() {
  const cookieStore = await cookies();
  const locale = cookieStore.get(i18nConfig.cookieName)?.value || i18nConfig.defaultLocale;

  const resources: Resource = {};
  
  for (const l of i18nConfig.locales) {
    resources[l] = {};
    const instance = await initI18next(l, i18nNamespaces);
    for (const ns of i18nNamespaces) {
      resources[l][ns] = instance.getResourceBundle(l, ns) || {};
    }
  }

  return { locale, resources };
}
