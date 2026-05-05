'use client';

import { type Table as TanstackTable } from '@tanstack/react-table';
import { useTranslation } from 'react-i18next';
import { Button } from '@repo/ui';

interface DataTablePaginationProps<TData> {
  table: TanstackTable<TData>;
  total?: number;
}

export function DataTablePagination<TData>({
  table,
  total,
}: DataTablePaginationProps<TData>) {
  const { t } = useTranslation('admin');
  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
        <p className="text-sm text-muted-foreground">
          {t('common.table.pageOf', {
            page: table.getState().pagination.pageIndex + 1,
            totalPages: table.getPageCount(),
          })}
        </p>
        {total !== undefined && (
          <p className="text-sm font-medium text-muted-foreground">
            {t('common.table.totalRecords', { total })}
          </p>
        )}
      </div>
      <div className="flex gap-2">

        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          {t('common.table.previous')}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          {t('common.table.next')}
        </Button>
      </div>
    </div>
  );
}
