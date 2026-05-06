export interface DataTableConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void | Promise<void>;
  title?: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
}

export type ActionDef =
  | {
      label: string;
      onAction: () => void | Promise<void>;
      variant?: 'default' | 'destructive';
      isDelete?: true;
      confirmTitle?: string;
      confirmDescription?: string;
      confirmLabel?: string;
      disabled?: boolean;
    }
  | { separator: true };

export type ProcessedItem =
  | {
      label: string;
      onClick: () => void;
      isLoading: boolean;
      variant?: 'default' | 'destructive';
    }
  | { separator: true };
