'use client';

import { useSidebar } from '@repo/ui';
import { Logo } from '@/components/shared/Logo';

export const SidebarLogo = () => {
  const { state } = useSidebar();
  const isCollapsed = state === 'collapsed';

  return (
    <div className="px-1 py-2">
      <Logo width={isCollapsed ? 36 : 150} iconOnly={isCollapsed} />
    </div>
  );
};
