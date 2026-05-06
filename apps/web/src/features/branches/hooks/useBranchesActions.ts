import { useTranslation } from 'react-i18next';
import { toast } from '@repo/ui';
import { Branch, BranchesTableHandlers } from '../types';
import { useMutationDeleteBranch } from './useBranchesQuery';

interface UseBranchesActionsProps {
  onEdit?: (branch: Branch) => void;
  onViewSchedule?: (branch: Branch) => void;
}

export function useBranchesActions({
  onEdit,
  onViewSchedule,
}: UseBranchesActionsProps = {}) {
  const { t } = useTranslation('admin');
  const deleteBranch = useMutationDeleteBranch();

  const onCopyId = async (id: string) => {
    await navigator.clipboard.writeText(id);
    toast.info(t('common.table.rowActions.idCopied', 'ID copied to clipboard'));
  };

  const handleEdit = (branch: Branch) => {
    onEdit?.(branch);
  };

  const handleDeactivate = (branch: Branch) => {
    // We don't await here to match the synchronous (void) signature in the interface
    // The actual mutation is handled internally
    mutateDeactivate(branch);
  };

  const mutateDeactivate = async (branch: Branch) => {
    try {
      await deleteBranch.mutateAsync(branch.id);
      toast.success(
        t('branch.index.actions.disableSuccess', 'Branch disabled successfully'),
      );
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ||
          t('branch.index.actions.disableError', 'Error disabling branch'),
      );
    }
  };

  return {
    handlers: {
      onCopyId,
      onEdit: handleEdit,
      onDeactivate: handleDeactivate,
      onViewSchedule: (branch: Branch) => onViewSchedule?.(branch),
    } satisfies BranchesTableHandlers,
  };
}
