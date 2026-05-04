import { useTranslation } from 'react-i18next';
import { Bell } from 'lucide-react';
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  cn,
} from '@repo/ui';
import { NotificationsButtonProps } from './helpers';

export const NotificationsMenu = ({
  notifications = [],
}: NotificationsButtonProps) => {
  const { t } = useTranslation('admin');
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label={t('common.topbar.notifications')}
          className="relative w-8 h-8"
        >
          <Bell className="size-4" />
          {unreadCount > 0 && (
            <span className="absolute right-1.5 top-1.5 size-2 rounded-full bg-brand" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-72">
        {notifications.length === 0 ? (
          <p className="px-3 py-4 text-center text-sm text-muted-foreground">
            {t('common.topbar.noNotifications')}
          </p>
        ) : (
          notifications.map((n) => (
            <DropdownMenuItem
              key={n.id}
              className={cn(!n.read && 'font-medium')}
            >
              {n.message}
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
