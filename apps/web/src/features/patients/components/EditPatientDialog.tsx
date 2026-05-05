'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@repo/ui';
import { useTranslation } from 'react-i18next';
import { PatientForm } from './PatientForm';
import type { Patient } from '../types';

interface EditPatientDialogProps {
  patient: Patient | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditPatientDialog({
  patient,
  open,
  onOpenChange,
}: EditPatientDialogProps) {
  const { t } = useTranslation('admin');

  if (!patient) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-150 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {t('patient.index.actions.edit', 'Edit Patient')}
          </DialogTitle>
        </DialogHeader>
        <PatientForm
          initialData={patient}
          onSuccess={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
