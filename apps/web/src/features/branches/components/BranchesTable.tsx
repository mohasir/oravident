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
import { useBranchesActions } from '../hooks/useBranchesActions';
import { useBranchesQuery } from '../hooks/useBranchesQuery';

import type { Branch } from '../types';

interface BranchesTableProps {
  onEdit?: (branch: Branch) => void;
}

export function BranchesTable({ onEdit }: BranchesTableProps) {
  const { t } = useTranslation('admin');
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const { handlers } = useBranchesActions({ onEdit });
  const columns = useColumns(handlers);

  const { data, isLoading } = useBranchesQuery({
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
  });
  const branches = data?.data?.items ?? [];

  const table = useReactTable({
    data: branches,
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
          placeholder={t('branch.index.table.filterName')}
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
        emptyMessage={t('branch.index.table.empty')}
      />

      <DataTablePagination
        table={table}
        total={data?.data?.pagination?.total}
      />
    </div>
  );
}
