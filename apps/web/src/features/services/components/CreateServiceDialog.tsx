'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@repo/ui';
import { ServiceForm } from './ServiceForm';
import { useTranslation } from 'react-i18next';

interface CreateServiceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateServiceDialog({
  open,
  onOpenChange,
}: CreateServiceDialogProps) {
  const { t } = useTranslation('admin');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>
            {t('service.create.title', 'Create New Service')}
          </DialogTitle>
          <DialogDescription>
            {t(
              'service.create.description',
              'Fill in the details below to create a new service for your clinic.',
            )}
          </DialogDescription>
        </DialogHeader>
        <ServiceForm onSuccess={() => onOpenChange(false)} className="py-4" />
      </DialogContent>
    </Dialog>
  );
}
