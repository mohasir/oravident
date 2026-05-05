import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import {
  useMutationCreateBranch,
  useMutationUpdateBranch,
} from './useBranchesQuery';
import {
  createBranchSchema,
  type CreateBranchSchema,
} from '../schemas/branch.schema';
import { toast } from '@repo/ui';
import type { Branch } from '../types';

interface UseBranchFormProps {
  initialData?: Branch;
  onSuccess?: () => void;
}

export function useBranchForm({
  initialData,
  onSuccess,
}: UseBranchFormProps = {}) {
  const { t } = useTranslation('admin');
  const createBranch = useMutationCreateBranch();
  const updateBranch = useMutationUpdateBranch();

  const isEditing = !!initialData;

  const form = useForm<CreateBranchSchema>({
    resolver: zodResolver(createBranchSchema),
    defaultValues: {
      name: initialData?.name ?? '',
      slug: initialData?.slug ?? '',
      address: initialData?.address ?? '',
      email: initialData?.email ?? '',
      phone: initialData?.phone ?? '',
      latitude: initialData?.latitude ?? '',
      longitude: initialData?.longitude ?? '',
      color: initialData?.color ?? '#000000',
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
        toast.success(
          t('branch.edit.success', 'Branch updated successfully'),
        );
      } else {
        await createBranch.mutateAsync(payload);
        toast.success(
          t('branch.create.success', 'Branch created successfully'),
        );
      }

      form.reset();
      onSuccess?.();
    } catch (e: any) {
      const errorMsg =
        e.response?.data?.message ||
        t('branch.form.error', 'Something went wrong');
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
