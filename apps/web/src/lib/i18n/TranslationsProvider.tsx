'use client';

import { I18nextProvider } from 'react-i18next';
import { createInstance, i18n } from 'i18next';
import { initReactI18next } from 'react-i18next/initReactI18next';
import resourcesToBackend from 'i18next-resources-to-backend';
import { ReactNode, useRef } from 'react';
import { i18nConfig } from './config';

import { Resource } from 'i18next';

export let clientI18n: i18n | null = null;

export default function TranslationsProvider({
  children,
  locale,
  namespaces,
  resources,
}: {
  children: ReactNode;
  locale: string;
  namespaces: string[];
  resources?: Resource;
}) {
  const i18nRef = useRef<i18n>(null);

  if (!i18nRef.current) {
    let newI18n;

    if (typeof window !== 'undefined' && clientI18n) {
      newI18n = clientI18n;
    } else {
      newI18n = createInstance();
      
      newI18n
        .use(initReactI18next)
        .use(
          resourcesToBackend(
            (language: string, namespace: string) =>
              import(`@/locales/${language}/${namespace}.json`)
          )
        )
        .init({
          lng: locale,
          resources,
          fallbackLng: i18nConfig.defaultLocale,
          supportedLngs: i18nConfig.locales,
          defaultNS: namespaces[0],
          fallbackNS: namespaces[0],
          ns: namespaces,
          preload: typeof window === 'undefined' ? [] : [locale],
        });

      if (typeof window !== 'undefined') {
        clientI18n = newI18n;
      }
    }

    i18nRef.current = newI18n;
  }

  return <I18nextProvider i18n={i18nRef.current}>{children}</I18nextProvider>;
}
