import { useTranslation } from 'react-i18next';
import { toast } from '@repo/ui';
import {
  Receptionist,
  ReceptionistsTableHandlers,
} from '@/features/receptionists/types';
import { useMutationDeleteReceptionist } from '@/features/receptionists/hooks/useReceptionistsQuery';

interface UseReceptionistsActionsProps {
  onEdit?: (receptionist: Receptionist) => void;
  onDelete?: (receptionist: Receptionist) => void;
}

export function useReceptionistsActions({
  onEdit,
  onDelete,
}: UseReceptionistsActionsProps = {}) {
  const { t } = useTranslation('admin');
  const deleteReceptionist = useMutationDeleteReceptionist();

  const onCopyId = async (id: string) => {
    await navigator.clipboard.writeText(id);
    toast.info(t('common.table.rowActions.idCopied'));
  };

  const handleEdit = (receptionist: Receptionist) => {
    onEdit?.(receptionist);
  };

  const handleDelete = async (receptionist: Receptionist) => {
    try {
      await deleteReceptionist.mutateAsync(receptionist.id);
      toast.success(t('receptionist.index.actions.deleteSuccess'));
      onDelete?.(receptionist);
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ||
          t('receptionist.index.actions.deleteError'),
      );
    }
  };

  return {
    handlers: {
      onCopyId,
      onEdit: handleEdit,
      onDelete: handleDelete,
    } satisfies ReceptionistsTableHandlers,
  };
}
