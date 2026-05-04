import type { User } from '@/mock/users';
import type { UsersTableHandlers } from '../types';

export function useUsersActions() {
  const onCopyId = (id: string) => navigator.clipboard.writeText(id);

  const onEdit = (_user: User) => {
    // TODO: open edit modal
    console.log(_user);
  };

  const onDeactivate = (_user: User) => {
    // TODO: open confirm dialog
    console.log(_user);
  };

  return {
    handlers: { onCopyId, onEdit, onDeactivate } satisfies UsersTableHandlers,
  };
}
