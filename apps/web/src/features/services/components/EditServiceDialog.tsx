'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogBody,
} from '@repo/ui';
import { ServiceForm } from './ServiceForm';
import { useTranslation } from 'react-i18next';
import type { Service } from '../types';

interface EditServiceDialogProps {
  service?: Service;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditServiceDialog({
  service,
  open,
  onOpenChange,
}: EditServiceDialogProps) {
  const { t } = useTranslation('admin');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>
            {t('service.edit.title', 'Edit Service')}
          </DialogTitle>
          <DialogDescription>
            {t(
              'service.edit.description',
              'Update the details of the service below.',
            )}
          </DialogDescription>
        </DialogHeader>
        {service && (
          <DialogBody>
            <ServiceForm
              initialData={service}
              onSuccess={() => onOpenChange(false)}
            />
          </DialogBody>
        )}
      </DialogContent>
    </Dialog>
  );
}
