'use client';

import TranslationsProvider from '@/lib/i18n/TranslationsProvider';
import { QueryProvider } from '@/lib/query/QueryProvider';
import { AuthProvider } from '@/components/provider/AuthProvider';
import { InitProvider } from '@/components/provider/InitProvider';
import { WrapperLoader } from '@/components/WrapperLoader';
import { Resource } from 'i18next';
import React from 'react';
import { Toaster } from '@repo/ui';

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
      <AuthProvider>
        <QueryProvider>
          <InitProvider>{children}</InitProvider>
        </QueryProvider>
      </AuthProvider>
      <WrapperLoader />
      <Toaster position="top-right" />
    </TranslationsProvider>
  );
}
