import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import {
  useMutationCreateService,
  useMutationUpdateService,
} from './useServicesQuery';
import {
  createServiceSchema,
  type CreateServiceSchema,
} from '../schemas/service.schema';
import { toast } from '@repo/ui';
import type { Service } from '../types';

interface UseServiceFormProps {
  initialData?: Service;
  onSuccess?: () => void;
}

export function useServiceForm({
  initialData,
  onSuccess,
}: UseServiceFormProps = {}) {
  const { t } = useTranslation('admin');
  const createService = useMutationCreateService();
  const updateService = useMutationUpdateService();

  const isEditing = !!initialData;

  const form = useForm<CreateServiceSchema>({
    resolver: zodResolver(createServiceSchema),
    defaultValues: {
      name: initialData?.name ?? '',
      description: initialData?.description ?? '',
      durationMinutes: initialData?.durationMinutes ?? 30,
      price: initialData?.price ?? '',
    },
  });

  const onSubmit = async (data: CreateServiceSchema) => {
    try {
      form.clearErrors('root');

      const payload = {
        ...data,
        description: data.description || undefined,
        price: data.price || undefined,
      };

      if (isEditing) {
        await updateService.mutateAsync({ id: initialData.id, data: payload });
        toast.success(
          t('service.edit.success', 'Service updated successfully'),
        );
      } else {
        await createService.mutateAsync(payload);
        toast.success(
          t('service.create.success', 'Service created successfully'),
        );
      }

      form.reset();
      onSuccess?.();
    } catch (e: any) {
      const errorMsg =
        e.response?.data?.message ||
        t('service.form.error', 'Something went wrong');
      form.setError('root', { message: errorMsg });
      toast.error(errorMsg);
    }
  };

  return {
    form,
    onSubmit: form.handleSubmit(onSubmit),
    isSubmitting: form.formState.isSubmitting,
    isDirty: form.formState.isDirty,
    isEditing,
    t,
  };
}
