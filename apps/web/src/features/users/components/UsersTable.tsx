'use client';

import { useState, useEffect } from 'react';
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
import { fetchUsers, type User } from '@/mock/users';
import { DataTable, DataTablePagination } from '@/components/shared/DataTable';
import { useUsersActions } from '../hooks/useUsersActions';

export function UsersTable() {
  const { t } = useTranslation('admin');
  const [data, setData] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const { handlers } = useUsersActions();
  const columns = useColumns(handlers);

  useEffect(() => {
    fetchUsers().then((users) => {
      setData(users);
      setLoading(false);
    });
  }, []);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    state: { sorting, columnFilters },
    initialState: { pagination: { pageSize: 5 } },
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Input
          placeholder={t('user.index.table.filterEmail')}
          value={(table.getColumn('email')?.getFilterValue() as string) ?? ''}
          onChange={(e) =>
            table.getColumn('email')?.setFilterValue(e.target.value)
          }
          className="max-w-sm"
        />
      </div>

      <DataTable
        table={table}
        isLoading={loading}
        columnCount={columns.length}
        emptyMessage={t('user.index.table.empty')}
      />

      <DataTablePagination table={table} />
    </div>
  );
}
