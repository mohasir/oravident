'use client';

import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';
import { Button } from '@repo/ui';
import { DataTableRowActions } from '@/components/shared/DataTable';
import type { Branch, BranchesTableHandlers } from '../types';

export function useColumns(handlers: BranchesTableHandlers): ColumnDef<Branch>[] {
  const { t } = useTranslation('admin');

  return useMemo(
    () => [
      {
        accessorKey: 'name',
        header: ({ column }) => (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="-ml-3"
          >
            {t('branch.index.table.name')}
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
      },
      {
        accessorKey: 'slug',
        header: () => t('branch.index.table.slug'),
      },
      {
        accessorKey: 'email',
        header: () => t('branch.index.table.email'),
        cell: ({ row }) => row.getValue('email') ?? '—',
      },
      {
        accessorKey: 'phone',
        header: () => t('branch.index.table.phone'),
        cell: ({ row }) => row.getValue('phone') ?? '—',
      },
      {
        accessorKey: 'isActive',
        header: () => t('branch.index.table.status'),
        cell: ({ row }) => {
          const value = row.getValue<boolean>('isActive');
          return (
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                value ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}
            >
              {value ? t('branch.index.table.active') : t('branch.index.table.inactive')}
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
            {t('branch.index.table.createdAt')}
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
      },
      {
        id: 'actions',
        cell: ({ row }) => {
          const branch = row.original;
          return (
            <DataTableRowActions
              label={t('common.table.actions')}
              actions={[
                { label: t('common.table.rowActions.copyId'), onAction: () => handlers.onCopyId(branch.id) },
                { separator: true },
                { label: t('branch.index.actions.edit'), onAction: () => handlers.onEdit(branch) },
                {
                  label: t('branch.index.actions.disable'),
                  variant: 'destructive',
                  isDelete: true,
                  confirmTitle: t('branch.index.actions.disableTitle'),
                  confirmDescription: t('branch.index.actions.confirmDisable', { name: branch.name }),
                  confirmLabel: t('branch.index.actions.disable'),
                  onAction: () => handlers.onDeactivate(branch),
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
