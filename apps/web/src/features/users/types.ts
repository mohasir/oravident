import type { Row } from '@tanstack/react-table';
import type { User } from '@/mock/users';

export interface UsersTableHandlers {
  onCopyId: (id: string) => Promise<void>;
  onEdit: (user: User) => void;
  onDeactivate: (user: User) => void;
}

export interface UserActionsCellProps {
  row: Row<User>;
  handlers: UsersTableHandlers;
}
