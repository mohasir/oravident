'use client';

import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { Button } from '@repo/ui';
import { Menu } from 'lucide-react';
import { Logo } from '@/components/shared/Logo/Logo';
import { LanguageSwitcher } from '@/components/shared/LanguageSwitcher/LanguageSwitcher';
import type { Route } from 'next';

export default function HomePage() {
  const { t } = useTranslation('public');

  return (
    <div className="h-screen overflow-hidden flex flex-col relative bg-background">
      {/* Decorative background */}
      <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-transparent pointer-events-none" />
      <div className="absolute -top-30 left-1/2 -translate-x-1/2 w-225 h-150 bg-primary/8 rounded-full blur-3xl pointer-events-none" />

      {/* Navbar */}
      <nav className="relative z-10 flex items-center justify-between px-5 sm:px-8 md:px-14 py-4 border-b border-border/50 bg-background/70 backdrop-blur-sm">
        <Logo width={120} />

        {/* Desktop links */}
        <div className="hidden sm:flex items-center gap-1">
          {/* <a
            href="#about"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-3 py-2 rounded-md hover:bg-accent/50"
          >
            {t('nav.about')}
          </a>
          <a
            href="#contact"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-3 py-2 rounded-md hover:bg-accent/50"
          >
            {t('nav.contact')}
          </a> */}
          <LanguageSwitcher />
        </div>

        {/* Mobile right side */}
        <div className="flex sm:hidden items-center gap-1">
          <LanguageSwitcher />
          <button
            aria-label="Menu"
            className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors"
          >
            <Menu className="size-5" />
          </button>
        </div>
      </nav>

      {/* Hero */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-6 md:px-12">
        <div className="max-w-3xl mx-auto flex flex-col items-center gap-5">
          <div className="mb-4">
            <Logo width={140} isPressable={false} />
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-primary leading-[1.1]">
            {t('landing.title')}
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-xl leading-relaxed">
            {t('landing.description')}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 mt-2">
            <Button size="lg" className="min-w-44" asChild>
              <Link href={'/login' as Route}>{t('landing.cta.primary')}</Link>
            </Button>
            <Button size="lg" variant="outline" className="min-w-44">
              {t('landing.cta.secondary')}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
