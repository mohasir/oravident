'use client';

import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';
import { Button } from '@repo/ui';
import { DataTableRowActions } from '@/components/shared/DataTable';
import type { Doctor, DoctorsTableHandlers } from '@/features/doctors/types';

export function useColumns(handlers: DoctorsTableHandlers): ColumnDef<Doctor>[] {
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
            {t('doctor.index.table.name')}
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
      },
      {
        accessorKey: 'specialty',
        header: () => t('doctor.index.table.specialty'),
        cell: ({ row }) => row.getValue('specialty') ?? '—',
      },
      {
        accessorKey: 'licenseNumber',
        header: () => t('doctor.index.table.licenseNumber'),
        cell: ({ row }) => row.getValue('licenseNumber') ?? '—',
      },
      {
        accessorKey: 'phone',
        header: () => t('doctor.index.table.phone'),
        cell: ({ row }) => row.getValue('phone') ?? '—',
      },
      {
        accessorKey: 'isActive',
        header: () => t('doctor.index.table.status'),
        cell: ({ row }) => {
          const value = row.getValue<boolean>('isActive');
          return (
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                value ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}
            >
              {value ? t('doctor.index.table.active') : t('doctor.index.table.inactive')}
            </span>
          );
        },
      },
      {
        id: 'actions',
        cell: ({ row }) => {
          const doctor = row.original;
          return (
            <DataTableRowActions
              label={t('common.table.actions')}
              actions={[
                { label: t('common.table.rowActions.copyId'), onAction: () => handlers.onCopyId(doctor.id) },
                { separator: true },
                { label: t('doctor.index.actions.edit'), onAction: () => handlers.onEdit(doctor), disabled: true },
                {
                  label: t('doctor.index.actions.delete'),
                  variant: 'destructive',
                  isDelete: true,
                  onAction: () => handlers.onDelete(doctor),
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
