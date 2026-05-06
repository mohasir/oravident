'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, LayoutDashboard } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useCan } from '@/lib/auth';
import { IconMap } from '@/lib/navigation';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from '@repo/ui';
import { NavMenuItemProps } from '@/components/shared/Sidebar/types';

export const NavMenuItem = ({ item }: NavMenuItemProps) => {
  const pathname = usePathname();
  const { t } = useTranslation('admin');
  const { can } = useCan();
  const { setOpenMobile, isMobile } = useSidebar();

  const handleLinkClick = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  const Icon = (item.icon ? IconMap[item.icon] : null) ?? LayoutDashboard;

  if (item.children && item.children.length > 0) {
    const visibleChildren = item.children.filter(
      (child) => !child.guard?.length || can(child.guard),
    );

    if (visibleChildren.length === 0) return null;

    const isChildActive = visibleChildren.some(
      (child) => child.href && (pathname ?? '').startsWith(child.href),
    );

    return (
      <Collapsible
        defaultOpen={isChildActive}
        className="group/collapsible w-full"
      >
        <SidebarMenuItem>
          <CollapsibleTrigger asChild>
            <SidebarMenuButton tooltip={t(item.label)}>
              <Icon />
              <span>{t(item.label)}</span>
              <ChevronRight className="ml-auto size-4 shrink-0 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
            </SidebarMenuButton>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <SidebarMenuSub>
              {visibleChildren.map((child) => {
                const ChildIcon =
                  (child.icon ? IconMap[child.icon] : null) ?? LayoutDashboard;
                const isSubActive = child.href
                  ? pathname === child.href
                  : false;
                return (
                  <SidebarMenuSubItem key={String(child.href ?? child.label)}>
                    <SidebarMenuSubButton asChild isActive={isSubActive}>
                      <Link href={child.href!} onClick={handleLinkClick}>
                        <ChildIcon />
                        <span>{t(child.label)}</span>
                      </Link>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                );
              })}
            </SidebarMenuSub>
          </CollapsibleContent>
        </SidebarMenuItem>
      </Collapsible>
    );
  }

  const isActive = item.href ? pathname === item.href : false;

  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild isActive={isActive} tooltip={t(item.label)}>
        <Link href={item.href!} onClick={handleLinkClick}>
          <Icon />
          <span>{t(item.label)}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};
