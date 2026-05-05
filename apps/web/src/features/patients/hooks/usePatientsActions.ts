import { useTranslation } from 'react-i18next';
import { toast } from '@repo/ui';
import { Patient, PatientsTableHandlers } from '../types';
import { useMutationDeletePatient } from './usePatientsQuery';

interface UsePatientsActionsProps {
  onEdit?: (patient: Patient) => void;
}

export function usePatientsActions({ onEdit }: UsePatientsActionsProps = {}) {
  const { t } = useTranslation('admin');
  const deletePatient = useMutationDeletePatient();

  const onCopyId = async (id: string) => {
    await navigator.clipboard.writeText(id);
    toast.info(t('common.table.rowActions.idCopied', 'ID copied to clipboard'));
  };

  const handleEdit = (patient: Patient) => {
    onEdit?.(patient);
  };

  const handleDelete = (patient: Patient) => {
    mutateDelete(patient);
  };

  const mutateDelete = async (patient: Patient) => {
    try {
      await deletePatient.mutateAsync(patient.id);
      toast.success(
        t('patient.index.actions.deleteSuccess', 'Patient deactivated successfully'),
      );
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ||
          t('patient.index.actions.deleteError', 'Error deactivating patient'),
      );
    }
  };

  return {
    handlers: {
      onCopyId,
      onEdit: handleEdit,
      onDelete: handleDelete,
    } satisfies PatientsTableHandlers,
  };
}
