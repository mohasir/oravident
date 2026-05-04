export interface NotificationItem {
  id: string;
  message: string;
  read: boolean;
}

export interface NotificationsButtonProps {
  notifications?: NotificationItem[];
}
