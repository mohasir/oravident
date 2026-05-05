'use client';

import { Spinner } from '@repo/ui';
import { useLoaderStore } from '@/lib/loader';

interface WrapperLoaderProps {
  isLoading?: boolean;
  message?: string | null;
}

export function WrapperLoader({ isLoading, message }: WrapperLoaderProps) {
  const { isVisible, message: storeMessage } = useLoaderStore();

  const visible = isLoading ?? isVisible;
  const msg = message !== undefined ? message : storeMessage;

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm">
      <Spinner className="size-8" />
      {msg && <p className="mt-3 text-sm text-muted-foreground">{msg}</p>}
    </div>
  );
}
