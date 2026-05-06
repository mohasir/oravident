'use client';

import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';
import { Button } from '@repo/ui';
import { DataTableRowActions } from '@/components/shared/DataTable';
import type { Receptionist, ReceptionistsTableHandlers } from '@/features/receptionists/types';

export function useColumns(handlers: ReceptionistsTableHandlers): ColumnDef<Receptionist>[] {
  const { t } = useTranslation('admin');

  return useMemo(
    () => [
      {
        accessorKey: 'fullName',
        header: ({ column }) => (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="-ml-3"
          >
            {t('receptionist.index.table.name')}
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
      },
      {
        accessorKey: 'phone',
        header: () => t('receptionist.index.table.phone'),
        cell: ({ row }) => row.getValue('phone') ?? '—',
      },
      {
        accessorKey: 'isActive',
        header: () => t('receptionist.index.table.status'),
        cell: ({ row }) => {
          const value = row.getValue<boolean>('isActive');
          return (
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                value ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}
            >
              {value ? t('receptionist.index.table.active') : t('receptionist.index.table.inactive')}
            </span>
          );
        },
      },
      {
        id: 'actions',
        cell: ({ row }) => {
          const receptionist = row.original;
          return (
            <DataTableRowActions
              label={t('common.table.actions')}
              actions={[
                { label: t('common.table.rowActions.copyId'), onAction: () => handlers.onCopyId(receptionist.id) },
                { separator: true },
                { label: t('receptionist.index.actions.edit'), onAction: () => handlers.onEdit(receptionist), disabled: true },
                {
                  label: t('receptionist.index.actions.delete'),
                  variant: 'destructive',
                  isDelete: true,
                  onAction: () => handlers.onDelete(receptionist),
                  disabled: true,
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
