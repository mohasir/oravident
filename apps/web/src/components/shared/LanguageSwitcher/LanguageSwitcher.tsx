'use client';

import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { i18nConfig } from '@/lib/i18n/config';
import { Button } from '@repo/ui';
import { Languages } from 'lucide-react';

export function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const router = useRouter();
  const currentLocale = i18n.language;

  const toggleLanguage = () => {
    const newLocale = currentLocale === 'es' ? 'en' : 'es';

    i18n.changeLanguage(newLocale);

    Cookies.set(i18nConfig.cookieName, newLocale, { expires: 365 });

    router.refresh();
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleLanguage}
      className="text-muted-foreground hover:text-foreground"
    >
      <Languages className="h-4 w-4" />
      {currentLocale === 'es' ? 'Español' : 'English'}
    </Button>
  );
}
