'use client';

import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';
import { Button } from '@repo/ui';
import { DataTableRowActions } from '@/components/shared/DataTable';
import type { Patient, PatientsTableHandlers } from '../types';

export function useColumns(handlers: PatientsTableHandlers): ColumnDef<Patient>[] {
  const { t } = useTranslation('admin');

  return useMemo(
    () => [
      {
        id: 'fullName',
        header: ({ column }) => (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="-ml-3"
          >
            {t('patient.index.table.name')}
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        accessorFn: (row) => `${row.firstName} ${row.lastName}`,
        cell: ({ row }) => {
          const patient = row.original;
          return `${patient.firstName} ${patient.lastName}`;
        }
      },
      {
        accessorKey: 'email',
        header: () => t('patient.index.table.email'),
        cell: ({ row }) => row.getValue('email') ?? '—',
      },
      {
        accessorKey: 'phone',
        header: () => t('patient.index.table.phone'),
        cell: ({ row }) => row.getValue('phone') ?? '—',
      },
      {
        accessorKey: 'isActive',
        header: () => t('patient.index.table.status'),
        cell: ({ row }) => {
          const value = row.getValue<boolean>('isActive');
          return (
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                value ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}
            >
              {value ? t('patient.index.table.active') : t('patient.index.table.inactive')}
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
            {t('patient.index.table.createdAt')}
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
      },
      {
        id: 'actions',
        cell: ({ row }) => {
          const patient = row.original;
          return (
            <DataTableRowActions
              label={t('common.table.actions')}
              actions={[
                { label: t('common.table.rowActions.copyId'), onAction: () => handlers.onCopyId(patient.id) },
                { separator: true },
                { label: t('patient.index.actions.edit'), onAction: () => handlers.onEdit(patient) },
                {
                  label: t('patient.index.actions.delete'),
                  variant: 'destructive',
                  isDelete: true,
                  confirmTitle: t('patient.index.actions.deleteTitle'),
                  confirmDescription: t('patient.index.actions.confirmDelete', { name: `${patient.firstName} ${patient.lastName}` }),
                  confirmLabel: t('patient.index.actions.delete'),
                  onAction: () => handlers.onDelete(patient),
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
