'use client';

import {
  Dialog,
  DialogTitle,
  DialogTrigger,
  DialogBody,
  Button,
  DialogHeader,
  DialogContent,
} from '@repo/ui';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PatientForm } from './PatientForm';

export function CreatePatientDialog() {
  const { t } = useTranslation('admin');
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="mr-2 h-4 w-4" />
          {t('patient.index.actions.create', 'Add Patient')}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-150">
        <DialogHeader>
          <DialogTitle>
            {t('patient.index.actions.create', 'Add Patient')}
          </DialogTitle>
        </DialogHeader>
        <DialogBody>
          <PatientForm onSuccess={() => setOpen(false)} />
        </DialogBody>
      </DialogContent>
    </Dialog>
  );
}
