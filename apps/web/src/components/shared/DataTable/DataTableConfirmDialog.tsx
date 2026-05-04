'use client';

import { useState } from 'react';
import { Loader2, Trash2Icon } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@repo/ui';
import type { DataTableConfirmDialogProps } from './types';

export function DataTableConfirmDialog({
  open,
  onOpenChange,
  onConfirm,
  title = 'Are you sure?',
  description = 'This action cannot be undone.',
  confirmLabel = 'Delete',
  cancelLabel = 'Cancel',
}: DataTableConfirmDialogProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    const result = onConfirm();
    if (result instanceof Promise) {
      setIsLoading(true);
      try {
        await result;
      } finally {
        setIsLoading(false);
        onOpenChange(false);
      }
    } else {
      onOpenChange(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader className="flex flex-col items-center justify-center text-center w-full">
          <AlertDialogTitle className="flex flex-col items-center justify-center gap-2 text-center w-full">
            <div className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive flex items-center justify-center p-2 rounded-xl size-10 shrink-0">
              <Trash2Icon className="size-5" />
            </div>
            <span className="text-xl font-semibold text-primary text-center">
              {title}
            </span>
          </AlertDialogTitle>
          <AlertDialogDescription className="flex flex-col gap-1 text-center items-center justify-center w-full mt-2">
            <span className="text-accent-foreground">{description}</span>
            <small className="text-sm text-muted-foreground mt-2">
              This action cannot be undone.
            </small>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="flex justify-center gap-2 w-full">
          <AlertDialogCancel disabled={isLoading}>
            {cancelLabel}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              handleConfirm();
            }}
            disabled={isLoading}
            className="bg-red-50 hover:bg-red-100 text-red-600"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {confirmLabel}
              </>
            ) : (
              confirmLabel
            )}
          </AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
