import type { Row } from '@tanstack/react-table';

export interface User {
  id: string;
  email: string;
  isPlatformAdmin: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface GetUsersParams {
  page?: number;
  limit?: number;
  email?: string;
  isActive?: boolean;
}

export interface CreateUserDTO {
  email: string;
  password: string;
  isPlatformAdmin?: boolean;
}

export interface UpdateUserDTO {
  email?: string;
  isPlatformAdmin?: boolean;
  isActive?: boolean;
}

export interface UsersTableHandlers {
  onCopyId: (id: string) => Promise<void>;
  onEdit: (user: User) => void;
  onDeactivate: (user: User) => void;
}

export interface UserActionsCellProps {
  row: Row<User>;
  handlers: UsersTableHandlers;
}
