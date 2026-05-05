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
import { usePatientsActions } from '../hooks/usePatientsActions';
import { usePatientsQuery } from '../hooks/usePatientsQuery';

import type { Patient } from '../types';

interface PatientsTableProps {
  onEdit?: (patient: Patient) => void;
}

export function PatientsTable({ onEdit }: PatientsTableProps) {
  const { t } = useTranslation('admin');
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const { handlers } = usePatientsActions({ onEdit });
  const columns = useColumns(handlers);

  const { data, isLoading } = usePatientsQuery({
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
  });
  const patients = data?.data?.items ?? [];

  const table = useReactTable({
    data: patients,
    columns,
    pageCount: data?.data?.pagination?.totalPages ?? -1,
    manualPagination: true,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onPaginationChange: setPagination,
    state: { sorting, columnFilters, pagination },
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Input
          placeholder={t('patient.index.table.filterName')}
          value={(table.getColumn('fullName')?.getFilterValue() as string) ?? ''}
          onChange={(e) =>
            table.getColumn('fullName')?.setFilterValue(e.target.value)
          }
          className="max-w-sm"
        />
      </div>

      <DataTable
        table={table}
        isLoading={isLoading}
        columnCount={columns.length}
        emptyMessage={t('patient.index.table.empty')}
      />

      <DataTablePagination
        table={table}
        total={data?.data?.pagination?.total}
      />
    </div>
  );
}
