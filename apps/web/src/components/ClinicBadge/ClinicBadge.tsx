'use client';

import Image, { StaticImageData } from 'next/image';
import { cn } from '@repo/ui';
import { useAuthStore } from '@/lib/auth';

interface ClinicBadgeProps {
  name?: string;
  imageSrc?: string | StaticImageData;
  slug?: string;
}

export function ClinicBadge({
  name: propName,
  imageSrc: propImageSrc,
  slug: propSlug,
}: ClinicBadgeProps) {
  const session = useAuthStore((s) => s.session);

  const clinicName = propName ?? session?.clinic?.name;
  const clinicSlug = propSlug ?? session?.clinic?.slug;
  const imageSrc = propImageSrc ?? session?.clinic?.logoUrl;

  if (!clinicName && !session?.clinic) {
    return null;
  }

  const initial = clinicName ? clinicName[0]?.toUpperCase() : '?';

  return (
    <div className={cn('flex items-center gap-2.5')}>
      {imageSrc ? (
        <div className="bg-card size-9 rounded-lg object-cover p-1">
          <Image
            src={imageSrc}
            alt={clinicName ?? 'Clinic'}
            width={36}
            height={36}
          />
        </div>
      ) : (
        <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg bg-brand/15 text-sm font-bold text-brand select-none">
          {initial}
        </span>
      )}
      <div className="flex flex-col">
        <div className="flex gap-1 items-center">
          <p className="hidden max-w-30 truncate text-sm text-left font-medium m-0 sm:block">
            {clinicName}
          </p>
        </div>
        {clinicSlug && (
          <p className="hidden max-w-30 truncate text-xs text-left text-muted-foreground font-medium m-0 sm:block">
            {clinicSlug}
          </p>
        )}
      </div>
    </div>
  );
}
