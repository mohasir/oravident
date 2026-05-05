'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@repo/ui';
import { BranchForm } from './BranchForm';
import { useTranslation } from 'react-i18next';
import type { Branch } from '../types';

interface EditBranchDialogProps {
  branch: Branch | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditBranchDialog({
  branch,
  open,
  onOpenChange,
}: EditBranchDialogProps) {
  const { t } = useTranslation('admin');

  if (!branch) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>
            {t('branch.edit.title', 'Edit Branch')}
          </DialogTitle>
          <DialogDescription>
            {t(
              'branch.edit.description',
              'Update the branch details below.',
            )}
          </DialogDescription>
        </DialogHeader>
        <BranchForm 
          initialData={branch} 
          onSuccess={() => onOpenChange(false)} 
          className="py-4" 
        />
      </DialogContent>
    </Dialog>
  );
}
