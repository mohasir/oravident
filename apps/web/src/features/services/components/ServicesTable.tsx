'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  type SortingState,
  type ColumnFiltersState,
} from '@tanstack/react-table';
import { Input } from '@repo/ui';
import { useColumns } from './columns';
import { DataTable, DataTablePagination } from '@/components/shared/DataTable';
import { useServicesActions } from '../hooks/useServicesActions';
import { useServicesQuery } from '../hooks/useServicesQuery';

import type { Service } from '../types';

interface ServicesTableProps {
  onEdit?: (service: Service) => void;
}

export function ServicesTable({ onEdit }: ServicesTableProps) {
  const { t } = useTranslation('admin');
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const { handlers } = useServicesActions({ onEdit });
  const columns = useColumns(handlers);

  const { data, isLoading } = useServicesQuery();
  const services = data?.data?.items ?? [];

  const table = useReactTable({
    data: services,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    state: { sorting, columnFilters },
    initialState: { pagination: { pageSize: 10 } },
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Input
          placeholder={t('service.index.table.filterName', 'Filter by name...')}
          value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
          onChange={(e) =>
            table.getColumn('name')?.setFilterValue(e.target.value)
          }
          className="max-w-sm"
        />
      </div>

      <DataTable
        table={table}
        isLoading={isLoading}
        columnCount={columns.length}
        emptyMessage={t('service.index.table.empty', 'No services found.')}
      />

      <DataTablePagination table={table} />
    </div>
  );
}
