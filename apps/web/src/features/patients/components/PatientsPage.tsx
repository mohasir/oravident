'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PatientsTable } from './PatientsTable';
import { CreatePatientDialog } from './CreatePatientDialog';
import { EditPatientDialog } from './EditPatientDialog';
import type { Patient } from '../types';

export function PatientsPage() {
  const { t } = useTranslation('admin');
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">
          {t('patient.index.title', 'Patients')}
        </h2>
        <div className="flex items-center space-x-2">
          <CreatePatientDialog />
        </div>
      </div>
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
