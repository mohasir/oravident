'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PageHeader } from '@/components/shared/PageHeader';
import { PatientsTable } from './PatientsTable';
import { CreatePatientDialog } from './CreatePatientDialog';
import { EditPatientDialog } from './EditPatientDialog';
import type { Patient } from '../types';

export function PatientsPage() {
  const { t } = useTranslation('admin');
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);

  return (
    <div>
      <PageHeader
        title={t('patient.index.title', 'Patients')}
      >
        <CreatePatientDialog />
      </PageHeader>
      <div className="space-y-4">
        <PatientsTable onEdit={setEditingPatient} />
      </div>

      <EditPatientDialog
        patient={editingPatient}
        open={!!editingPatient}
        onOpenChange={(open) => !open && setEditingPatient(null)}
      />
    </div>
  );
}
