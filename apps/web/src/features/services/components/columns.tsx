'use client';

import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';
import { Button } from '@repo/ui';
import { DataTableRowActions } from '@/components/shared/DataTable';
import type { Service, ServicesTableHandlers } from '../types';

export function useColumns(handlers: ServicesTableHandlers): ColumnDef<Service>[] {
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
            {t('service.index.table.name', 'Name')}
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
      },
      {
        accessorKey: 'durationMinutes',
        header: () => t('service.index.table.duration', 'Duration (min)'),
        cell: ({ row }) => `${row.getValue('durationMinutes')} min`,
      },
      {
        accessorKey: 'price',
        header: () => t('service.index.table.price', 'Price'),
        cell: ({ row }) => {
          const price = row.getValue<string>('price');
          return price ? `$${price}` : '—';
        },
      },
      {
        accessorKey: 'isActive',
        header: () => t('service.index.table.status', 'Status'),
        cell: ({ row }) => {
          const value = row.getValue<boolean>('isActive');
          return (
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                value ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}
            >
              {value ? t('service.index.table.active', 'Active') : t('service.index.table.inactive', 'Inactive')}
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
            {t('service.index.table.createdAt', 'Created At')}
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
      },
      {
        id: 'actions',
        cell: ({ row }) => {
          const service = row.original;
          return (
            <DataTableRowActions
              label={t('common.table.actions', 'Actions')}
              actions={[
                { label: t('common.table.rowActions.copyId', 'Copy ID'), onAction: () => handlers.onCopyId(service.id) },
                { separator: true },
                { label: t('service.index.actions.edit', 'Edit Service'), onAction: () => handlers.onEdit(service) },
                {
                  label: t('service.index.actions.disable', 'Disable'),
                  variant: 'destructive',
                  isDelete: true,
                  confirmTitle: t('service.index.actions.disableTitle', 'Disable Service'),
                  confirmDescription: t('service.index.actions.confirmDisable', { name: service.name }),
                  confirmLabel: t('service.index.actions.disable', 'Disable'),
                  onAction: () => handlers.onDeactivate(service),
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
