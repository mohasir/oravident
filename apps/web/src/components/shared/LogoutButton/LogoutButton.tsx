'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/hook/useAuth';
import { DEFAULT_REDIRECT_LOGIN } from '@/lib/auth/navigation';

interface LogoutButtonProps {
  children: React.ReactNode;
  className?: string;
}

export function LogoutButton({ children, className }: LogoutButtonProps) {
  const { signOut } = useAuth();
  const router = useRouter();

  async function handleLogout() {
    await signOut();
    router.push(DEFAULT_REDIRECT_LOGIN);
  }

  return (
    <button type="button" className={className} onClick={handleLogout}>
      {children}
    </button>
  );
}
