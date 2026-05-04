'use client';

import { useTranslation } from 'react-i18next';
import { ReactNode } from 'react';
import { LanguageSwitcher } from '@/components/shared/LanguageSwitcher/LanguageSwitcher';
import { Logo } from '@/components/shared/Logo';
import { Card } from '@repo/ui';

export function AuthLayoutContainer({ children }: { children: ReactNode }) {
  const { t } = useTranslation('admin');

  return (
    <div className="flex min-h-screen flex-col bg-brand-neutral">
      <div className="mx-auto w-full max-w-7xl flex flex-1 flex-col">
        {/* Header */}
        <header className="flex items-center justify-between px-8 py-6 lg:px-12">
          <Logo />
          <LanguageSwitcher />
        </header>

        {/* Body */}
        <main className="flex flex-1 items-center gap-12 px-8 pb-8 lg:gap-16 lg:px-12 lg:pb-12">
          {/* Left — marketing copy */}
          <div className="hidden lg:flex flex-1 min-w-0 flex-col space-y-5">
            <h2 className="text-4xl leading-tight font-bold text-primary">
              {t('auth.login.marketing.titleLine1')}
              <br />
              {t('auth.login.marketing.titleLine2')}{' '}
              <span className="text-accent">
                {t('auth.login.marketing.titleAccent1')}
              </span>
              <br />
              {t('auth.login.marketing.titleLine3')}{' '}
              <span className="text-accent">
                {t('auth.login.marketing.titleAccent2')}
              </span>
            </h2>
            <p className="text-base text-primary/70 max-w-sm">
              {t('auth.login.marketing.description')}
            </p>
          </div>

          {/* Right — white card */}
          <Card className="flex-1 p-7 lg:p-10">{children}</Card>
        </main>
      </div>
    </div>
  );
}
