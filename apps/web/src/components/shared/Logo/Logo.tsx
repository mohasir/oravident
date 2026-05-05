'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import logoLight from '@/assets/logoLight.svg';
import logoDark from '@/assets/logoDark.svg';
import faviconLight from '@/assets/faviconLight.svg';
import faviconDark from '@/assets/faviconDark.svg';
import type { Route } from 'next';

type Theme = 'light' | 'dark' | 'system';

interface LogoProps {
  theme?: Theme;
  className?: string;
  width?: number;
  alt?: string;
  iconOnly?: boolean;
  href?: string;
  isPressable?: boolean;
}

function resolveTheme(theme: Theme): 'light' | 'dark' {
  if (theme !== 'system') return theme;
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
}

export function Logo({
  theme = 'system',
  className,
  width = 180,
  alt = 'OraviDent',
  iconOnly = false,
  href = '/',
  isPressable = true,
}: Omit<LogoProps, 'height'>) {
  const [resolved, setResolved] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    setResolved(resolveTheme(theme));

    if (theme !== 'system') return;

    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent) =>
      setResolved(e.matches ? 'dark' : 'light');

    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [theme]);

  const src = iconOnly
    ? resolved === 'dark'
      ? faviconDark
      : faviconLight
    : resolved === 'dark'
      ? logoDark
      : logoLight;

  const image = (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={0}
      className={className}
      style={{ width, height: 'auto' }}
      priority
    />
  );

  if (!isPressable) {
    return image;
  }

  return <Link href={href as Route}>{image}</Link>;
}
