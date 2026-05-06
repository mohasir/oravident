import { useTranslation } from 'react-i18next';
import { toast } from '@repo/ui';
import { Doctor, DoctorsTableHandlers } from '@/features/doctors/types';
import { useMutationDeleteDoctor } from '@/features/doctors/hooks/useDoctorsQuery';

interface UseDoctorsActionsProps {
  onEdit?: (doctor: Doctor) => void;
  onDelete?: (doctor: Doctor) => void;
}

export function useDoctorsActions({
  onEdit,
  onDelete,
}: UseDoctorsActionsProps = {}) {
  const { t } = useTranslation('admin');
  const deleteDoctor = useMutationDeleteDoctor();

  const onCopyId = async (id: string) => {
    await navigator.clipboard.writeText(id);
    toast.info(t('common.table.rowActions.idCopied'));
  };

  const handleEdit = (doctor: Doctor) => {
    onEdit?.(doctor);
  };

  const handleDelete = async (doctor: Doctor) => {
    try {
      await deleteDoctor.mutateAsync(doctor.id);
      toast.success(t('doctor.index.actions.deleteSuccess'));
      onDelete?.(doctor);
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || t('doctor.index.actions.deleteError'),
      );
    }
  };

  return {
    handlers: {
      onCopyId,
      onEdit: handleEdit,
      onDelete: handleDelete,
    } satisfies DoctorsTableHandlers,
  };
}
