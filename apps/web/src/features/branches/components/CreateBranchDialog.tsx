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

interface CreateBranchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateBranchDialog({
  open,
  onOpenChange,
}: CreateBranchDialogProps) {
  const { t } = useTranslation('admin');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>
            {t('branch.create.title', 'Create New Branch')}
          </DialogTitle>
          <DialogDescription>
            {t(
              'branch.create.description',
              'Fill in the details below to create a new branch for your clinic.',
            )}
          </DialogDescription>
        </DialogHeader>
        <BranchForm onSuccess={() => onOpenChange(false)} className="py-4" />
      </DialogContent>
    </Dialog>
  );
}
