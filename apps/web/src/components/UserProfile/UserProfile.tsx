'use client';

import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { User, Settings, LogOut, ChevronDown } from 'lucide-react';
import { getMockSession } from '@/mock/session';
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
  const session = getMockSession();

  const userName = session.name;
  const userAvatar = session.avatarUrl;

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
            <span className="hidden max-w-30 truncate text-sm font-medium sm:block">
              {userName}
            </span>
            <ChevronDown className="size-3.5 opacity-50" />
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
            onClick={() => console.log('logout')}
          >
            <LogOut className="size-4" />
            {t('common.menu.logout')}
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
