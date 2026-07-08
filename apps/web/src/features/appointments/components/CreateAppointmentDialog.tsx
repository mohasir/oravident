'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogBody,
} from '@repo/ui';
import { useTranslation } from 'react-i18next';
import { AppointmentForm } from './AppointmentForm';

interface CreateAppointmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialDate?: Date;
  onSuccess?: () => void;
}

export function CreateAppointmentDialog({
  open,
  onOpenChange,
  initialDate,
  onSuccess,
}: CreateAppointmentDialogProps) {
  const { t } = useTranslation('admin');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {t('appointment.create.title', 'Nueva Cita')}
          </DialogTitle>
        </DialogHeader>
        <DialogBody>
          <AppointmentForm
            initialDate={initialDate}
            onSuccess={() => {
              onSuccess?.();
              onOpenChange(false);
            }}
          />
        </DialogBody>
      </DialogContent>
    </Dialog>
  );
}
