'use client';

import logoClinic from '@/assets/mock/logoClinic.png';
import { getMockClinic } from '@/mock/clinic';
import { SidebarTrigger } from '@repo/ui';
import { ClinicBadge } from '@/components/ClinicBadge/ClinicBadge';
import { LanguageSwitcher } from '@/components/shared/LanguageSwitcher';
import { NotificationsMenu } from '@/components/NotificationMenu/NotificationMenu';
import { UserMenu } from '@/components/UserProfile/UserProfile';
import { TopbarProps } from '@/components/shared/Topbar/types';

export const Topbar = ({ notifications }: TopbarProps) => {
  const clinic = getMockClinic();

  return (
    <div className="bg-brand-neutral/80 flex h-14 items-center justify-between px-4">
      <div className="flex items-center gap-2">
        <SidebarTrigger />
        <ClinicBadge name={clinic.name} imageSrc={logoClinic} />
      </div>

      <div className="flex items-center gap-1">
        <LanguageSwitcher />
        <NotificationsMenu notifications={notifications} />
        <UserMenu />
      </div>
    </div>
  );
};
