import { AppProviders } from '@/components/AppProviders';
import { APP_CONFIG } from '@/config/app.config';
import { i18nNamespaces } from '@/lib/i18n/config';
import { getI18nResources } from '@/lib/i18n/server';
import { fustat } from '@/theme/fonts';
import '@/theme/globals.css';

export const metadata = APP_CONFIG.metadata;

export default async function RootLayoutContainer({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { locale, resources } = await getI18nResources();

  return (
    <html lang={locale} className={fustat.variable}>
      <body className="antialiased">
        <AppProviders
          locale={locale}
          namespaces={i18nNamespaces}
          resources={resources}
        >
          <main>{children}</main>
        </AppProviders>
      </body>
    </html>
  );
}
