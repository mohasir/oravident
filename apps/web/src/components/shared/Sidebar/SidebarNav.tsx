'use client';

import { useTranslation } from 'react-i18next';
import { useCan } from '@/lib/auth';
import { useNavigation } from '@/lib/navigation';
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuSkeleton,
} from '@repo/ui';
import { isGroupVisible } from '@/components/shared/Sidebar/helpers';
import { NavMenuItem } from '@/components/shared/Sidebar/NavMenuItem';

export const SidebarNav = () => {
  const { t } = useTranslation('admin');
  const { can, isLoading: isCanLoading } = useCan();
  const { menu, isLoading: isNavLoading } = useNavigation();

  const isLoading = isCanLoading || isNavLoading;

  if (isLoading) {
    return (
      <SidebarGroup>
        <SidebarGroupContent>
          <SidebarMenu>
            {[1, 2, 3, 4, 5].map((i) => (
              <SidebarMenuItem key={i}>
                <SidebarMenuSkeleton showIcon />
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    );
  }

  return (
    <>
      {menu.map((group, index) => {
        if (!isGroupVisible(group, can)) return null;

        return (
          <SidebarGroup key={index}>
            {group.group && (
              <SidebarGroupLabel>{t(group.group)}</SidebarGroupLabel>
            )}
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <NavMenuItem
                    key={String(item.href ?? item.label)}
                    item={item}
                  />
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        );
      })}
    </>
  );
};
