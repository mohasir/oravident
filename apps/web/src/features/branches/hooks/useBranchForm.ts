import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import {
  useMutationCreateBranch,
  useMutationUpdateBranch,
} from '@/features/branches/hooks/useBranchesQuery';
import {
  CreateBranchFormInput,
  CreateBranchSchema,
  createBranchSchema,
} from '@/features/branches/schemas/branch.schema';
import { groupSchedulesByTime } from '@/features/branches/helpers';
import { toast } from '@repo/ui';
import type { Branch } from '@/features/branches/types';
import { useApiErrorParser } from '@/lib/http/useApiErrorParser';

interface UseBranchFormProps {
  initialData?: Branch;
  onSuccess?: () => void;
}

export function useBranchForm({
  initialData,
  onSuccess,
}: UseBranchFormProps = {}) {
  const { t } = useTranslation('admin');
  const parseError = useApiErrorParser();
  const createBranch = useMutationCreateBranch();
  const updateBranch = useMutationUpdateBranch();

  const isEditing = !!initialData;

  const form = useForm<CreateBranchFormInput, unknown, CreateBranchSchema>({
    resolver: zodResolver(createBranchSchema),
    defaultValues: {
      name: initialData?.name ?? '',
      address: initialData?.address ?? '',
      email: initialData?.email ?? '',
      phone: initialData?.phone ?? '',
      latitude: initialData?.latitude ?? '',
      longitude: initialData?.longitude ?? '',
      color: initialData?.color ?? '#0D9488',
      schedules: initialData?.schedules
        ? groupSchedulesByTime(initialData.schedules)
        : [],
    },
  });

  const onSubmit = async (data: CreateBranchSchema) => {
    try {
      form.clearErrors('root');

      const payload = {
        ...data,
        email: data.email || undefined,
        phone: data.phone || undefined,
        latitude: data.latitude || undefined,
        longitude: data.longitude || undefined,
        color: data.color || undefined,
      };

      if (isEditing) {
        await updateBranch.mutateAsync({ id: initialData.id, data: payload });
        toast.success(t('branch.edit.success', 'Branch updated successfully'));
      } else {
        await createBranch.mutateAsync(payload);
        toast.success(
          t('branch.create.success', 'Branch created successfully'),
        );
      }

      form.reset();
      onSuccess?.();
    } catch (e) {
      parseError(e, (message) => {
        form.setError('root', { message });
        toast.error(message);
      });
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
