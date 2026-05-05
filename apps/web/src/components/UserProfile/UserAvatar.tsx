'use client';

import { cn } from '@repo/ui';
import Image from 'next/image';

export const UserAvatar = ({
  name,
  avatarUrl,
  className,
}: {
  name?: string;
  avatarUrl?: string;
  className?: string;
}) => {
  const initials = name
    ? name
        .split(' ')
        .slice(0, 2)
        .map((w) => w[0])
        .join('')
        .toUpperCase()
    : '?';

  if (avatarUrl) {
    return (
      <Image
        src={avatarUrl}
        alt={name ?? 'User'}
        width={38}
        height={38}
        className={cn('size-8 rounded-full object-cover', className)}
      />
    );
  }

  return (
    <span
      className={cn(
        'inline-flex size-9 items-center justify-center rounded-full bg-brand/15 text-xs font-semibold text-brand select-none',
        className,
      )}
    >
      {initials}
    </span>
  );
};
