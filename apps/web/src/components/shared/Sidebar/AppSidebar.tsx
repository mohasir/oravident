'use client';

import { LogOut } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@repo/ui';
import { WarehouseSwitcher } from '@/components/warehouse-switcher/WarehouseSwitcher';
import { LogoutButton } from '@/components/shared/LogoutButton';
import { SidebarLogo } from './SidebarLogo';
import { SidebarNav } from './SidebarNav';

export const AppSidebar = () => {
  const { t } = useTranslation('admin');

  return (
    <Sidebar collapsible="icon" variant="floating">
      <SidebarHeader>
        <SidebarLogo />
        <div className="group-data-[collapsible=icon]:hidden">
          <WarehouseSwitcher />
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarNav />
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip={t('nav.logout')} asChild>
              <LogoutButton>
                <LogOut />
                <span>{t('common.menu.logout')}</span>
              </LogoutButton>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
};
