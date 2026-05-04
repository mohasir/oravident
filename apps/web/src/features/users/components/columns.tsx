'use client';

import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';
import { Button } from '@repo/ui';
import type { User } from '@/mock/users';
import { DataTableRowActions } from '@/components/shared/DataTable';
import type { UsersTableHandlers } from '../types';

export function useColumns(handlers: UsersTableHandlers): ColumnDef<User>[] {
  const { t } = useTranslation('admin');

  return useMemo(
    () => [
      {
        accessorKey: 'email',
        header: ({ column }) => (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="-ml-3"
          >
            {t('user.email')}
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
      },
      {
        accessorKey: 'isPlatformAdmin',
        header: () => t('user.platformAdmin'),
        cell: ({ row }) => {
          const value = row.getValue<boolean>('isPlatformAdmin');
          return (
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                value ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600'
              }`}
            >
              {value ? 'Admin' : 'User'}
            </span>
          );
        },
      },
      {
        accessorKey: 'isActive',
        header: () => t('user.status'),
        cell: ({ row }) => {
          const value = row.getValue<boolean>('isActive');
          return (
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                value ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}
            >
              {value ? t('user.active') : t('user.inactive')}
            </span>
          );
        },
      },
      {
        accessorKey: 'createdAt',
        header: ({ column }) => (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="-ml-3"
          >
            {t('user.createdAt')}
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
      },
      {
        id: 'actions',
        cell: ({ row }) => {
          const user = row.original;
          return (
            <DataTableRowActions
              label={t('common.table.actions')}
              actions={[
                { label: t('user.copyId'), onAction: () => handlers.onCopyId(user.id) },
                { separator: true },
                { label: t('user.editUser'), onAction: () => handlers.onEdit(user) },
                {
                  label: t('user.deactivate'),
                  variant: 'destructive',
                  isDelete: true,
                  confirmTitle: t('user.deactivateUser'),
                  confirmDescription: t('user.confirmDeactivate', { email: user.email }),
                  confirmLabel: t('user.deactivate'),
                  onAction: () => handlers.onDeactivate(user),
                },
              ]}
            />
          );
        },
      },
    ],
    [t, handlers]
  );
}
