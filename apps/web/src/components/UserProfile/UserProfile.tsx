'use client';

import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { User, Settings, LogOut, ChevronDown } from 'lucide-react';
import { useAuthStore } from '@/lib/auth';
import { useAuth } from '@/lib/auth/hook/useAuth';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Button,
} from '@repo/ui';
import { UserAvatar } from './UserAvatar';

export const UserMenu = () => {
  const { t } = useTranslation('admin');
  const session = useAuthStore((s) => s.session);
  const { signOut: logout } = useAuth();

  const userName =
    session?.worker?.fullName ?? session?.email?.split('@')[0] ?? 'User';
  const roleName = session?.isPlatformAdmin
    ? 'Superadmin'
    : session?.role?.name || null;
  const userAvatar = undefined;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex justify-center items-center gap-1">
          <UserAvatar name={userName} avatarUrl={userAvatar} />
          <Button
            variant="ghost"
            className="gap-2 px-1 pl-2"
            aria-label={userName}
          >
            <div className="flex flex-col">
              <div className="flex gap-1 items-center">
                <p className="hidden max-w-30 truncate text-sm text-left font-medium m-0 sm:block">
                  {userName}
                </p>
                <ChevronDown className="size-3.5 opacity-50" />
              </div>
              <p className="hidden max-w-30 truncate text-xs text-left text-muted-foreground font-medium m-0 sm:block">
                {roleName}
              </p>
            </div>
          </Button>
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-52">
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href="/admin/profile">
              <User className="size-4" />
              {t('common.topbar.account')}
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/admin/settings">
              <Settings className="size-4" />
              {t('common.topbar.settings')}
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="text-destructive focus:bg-destructive/10 focus:text-destructive"
            onClick={logout}
          >
            <LogOut className="size-4" />
            {t('common.menu.logout')}
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
