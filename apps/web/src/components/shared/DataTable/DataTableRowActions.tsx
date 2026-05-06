'use client';

import { useState } from 'react';
import { Loader2, MoreHorizontal } from 'lucide-react';
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@repo/ui';
import type { ActionDef } from './types';
import { DataTableConfirmDialog } from './DataTableConfirmDialog';

interface DataTableRowActionsProps {
  actions: ActionDef[];
  label?: string;
}

type ActionItem = Extract<ActionDef, { label: string }>;

export function DataTableRowActions({
  actions,
  label = 'Actions',
}: DataTableRowActionsProps) {
  const [loadingMap, setLoadingMap] = useState<Record<number, boolean>>({});
  const [pendingDelete, setPendingDelete] = useState<ActionItem | null>(null);

  const isAnyLoading = Object.values(loadingMap).some(Boolean);

  const handleClick = (action: ActionItem, index: number) => {
    if (action.isDelete) {
      setPendingDelete(action);
      return;
    }
    const result = action.onAction();
    if (result instanceof Promise) {
      setLoadingMap((prev) => ({ ...prev, [index]: true }));
      result.finally(() =>
        setLoadingMap((prev) => ({ ...prev, [index]: false })),
      );
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="h-8 w-8 p-0"
            disabled={isAnyLoading}
          >
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>{label}</DropdownMenuLabel>
          {actions.map((action, i) => {
            if ('separator' in action) {
              return <DropdownMenuSeparator key={i} />;
            }
            const isLoading = loadingMap[i] ?? false;
            return (
              <DropdownMenuItem
                key={i}
                onClick={() => !action.disabled && handleClick(action, i)}
                disabled={isLoading || action.disabled}
                className={
                  action.variant === 'destructive' ? 'text-red-600' : ''
                }
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {action.label}
                  </>
                ) : (
                  action.label
                )}
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>

      {pendingDelete && (
        <DataTableConfirmDialog
          open
          onOpenChange={(open) => !open && setPendingDelete(null)}
          onConfirm={pendingDelete.onAction}
          title={pendingDelete.confirmTitle}
          description={pendingDelete.confirmDescription}
          confirmLabel={pendingDelete.confirmLabel ?? pendingDelete.label}
        />
      )}
    </>
  );
}
