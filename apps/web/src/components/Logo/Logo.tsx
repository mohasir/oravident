'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import logoLight from '@/assets/logoLight.png';
import logoDark from '@/assets/logoDark.png';

type Theme = 'light' | 'dark' | 'system';

interface LogoProps {
  theme?: Theme;
  className?: string;
  width?: number;
  alt?: string;
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

  return (
    <Image
      src={resolved === 'dark' ? logoDark : logoLight}
      alt={alt}
      width={width}
      height={0}
      className={className}
      style={{ width, height: 'auto' }}
      priority
    />
  );
}
