'use client';

import TranslationsProvider from '@/lib/i18n/TranslationsProvider';
import { QueryProvider } from '@/lib/query/QueryProvider';
import { Resource } from 'i18next';
import React from 'react';

interface AppProvidersProps {
  children: React.ReactNode;
  locale: string;
  namespaces: string[];
  resources: Resource;
}

export function AppProviders({
  children,
  locale,
  namespaces,
  resources,
}: AppProvidersProps) {
  return (
    <TranslationsProvider
      locale={locale}
      namespaces={namespaces}
      resources={resources}
    >
      <QueryProvider>{children}</QueryProvider>
    </TranslationsProvider>
  );
}
