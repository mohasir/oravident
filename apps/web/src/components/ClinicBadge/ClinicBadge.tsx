'use client';

import Image from 'next/image';
import type { StaticImport } from 'next/dist/shared/lib/get-img-props';
import { cn } from '@repo/ui';

interface ClinicBadgeProps {
  name?: string;
  imageSrc?: string | StaticImport;
  className?: string;
}

export function ClinicBadge({ name, imageSrc, className }: ClinicBadgeProps) {
  const initial = name ? name[0].toUpperCase() : '?';

  return (
    <div className={cn('flex items-center gap-2.5', className)}>
      {imageSrc ? (
        <Image
          src={imageSrc}
          alt={name ?? 'Clinic'}
          width={36}
          height={36}
          className="size-9 rounded-lg object-cover"
        />
      ) : (
        <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg bg-brand/15 text-sm font-bold text-brand select-none">
          {initial}
        </span>
      )}
      <span className="hidden text-md font-semibold sm:block text-primary">
        {name}
      </span>
    </div>
  );
}
