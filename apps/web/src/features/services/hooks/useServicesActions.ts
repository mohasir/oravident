import { useTranslation } from 'react-i18next';
import { toast } from '@repo/ui';
import { Service, ServicesTableHandlers } from '../types';
import { useMutationDeleteService } from './useServicesQuery';

interface UseServicesActionsProps {
  onEdit?: (service: Service) => void;
}

export function useServicesActions({ onEdit }: UseServicesActionsProps = {}) {
  const { t } = useTranslation('admin');
  const deleteService = useMutationDeleteService();

  const onCopyId = async (id: string) => {
    await navigator.clipboard.writeText(id);
    toast.info(t('common.table.rowActions.idCopied', 'ID copied to clipboard'));
  };

  const handleEdit = (service: Service) => {
    onEdit?.(service);
  };

  const handleDeactivate = (service: Service) => {
    mutateDeactivate(service);
  };

  const mutateDeactivate = async (service: Service) => {
    try {
      await deleteService.mutateAsync(service.id);
      toast.success(
        t('service.index.actions.disableSuccess', 'Service disabled successfully'),
      );
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ||
          t('service.index.actions.disableError', 'Error disabling service'),
      );
    }
  };

  return {
    handlers: {
      onCopyId,
      onEdit: handleEdit,
      onDeactivate: handleDeactivate,
    } satisfies ServicesTableHandlers,
  };
}
