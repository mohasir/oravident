'use client';

import { flexRender, type Table as TanstackTable } from '@tanstack/react-table';
import { useTranslation } from 'react-i18next';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Skeleton,
} from '@repo/ui';

interface DataTableProps<TData> {
  table: TanstackTable<TData>;
  isLoading?: boolean;
  columnCount?: number;
  emptyMessage?: string;
}

export function DataTable<TData>({
  table,
  isLoading = false,
  columnCount,
  emptyMessage,
}: DataTableProps<TData>) {
  const { t } = useTranslation('admin');
  const empty = emptyMessage ?? t('common.table.emptyMessage');
  const colCount = columnCount ?? table.getAllColumns().length;

  return (
    <div className="rounded-md border overflow-x-auto">
      <Table className="min-w-full">
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header, index) => {
                const isLast = index === headerGroup.headers.length - 1;
                return (
                  <TableHead
                    key={header.id}
                    className={
                      isLast
                        ? 'sticky right-0 bg-brand-neutral z-10 text-right'
                        : ''
                    }
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>

        <TableBody>
          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                {Array.from({ length: colCount }).map((_, j) => (
                  <TableCell
                    key={j}
                    className={
                      j === colCount - 1
                        ? 'sticky right-0 bg-brand-neutral z-10'
                        : ''
                    }
                  >
                    <Skeleton className="h-5 w-full" />
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : table.getRowModel().rows.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && 'selected'}
              >
                {row.getVisibleCells().map((cell, index) => {
                  const isLast = index === row.getVisibleCells().length - 1;
                  return (
                    <TableCell
                      key={cell.id}
                      className={
                        isLast
                          ? 'sticky right-0 bg-brand-neutral z-10 text-right'
                          : ''
                      }
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={colCount} className="h-24 text-center">
                {empty}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
