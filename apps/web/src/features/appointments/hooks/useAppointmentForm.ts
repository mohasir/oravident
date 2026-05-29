'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import {
  useMutationCreateAppointment,
  useMutationUpdateAppointment,
} from './useAppointmentsQuery';
import {
  createAppointmentSchema,
  type CreateAppointmentSchema,
} from '../schemas/appointment.schema';
import { toast } from '@repo/ui';
import type { Appointment } from '../types';
import { useApiErrorParser } from '@/lib/http/useApiErrorParser';

interface UseAppointmentFormProps {
  initialData?: Appointment;
  onSuccess?: () => void;
}

export function useAppointmentForm({
  initialData,
  onSuccess,
}: UseAppointmentFormProps = {}) {
  const { t } = useTranslation('admin');
  const parseError = useApiErrorParser();
  const createAppointment = useMutationCreateAppointment();
  const updateAppointment = useMutationUpdateAppointment();

  const isEditing = !!initialData;

  const form = useForm<CreateAppointmentSchema>({
    resolver: zodResolver(createAppointmentSchema),
    defaultValues: {
      branchId: initialData?.branch?.id ?? '',
      patientId: initialData?.patient?.id ?? '',
      workerId: initialData?.worker?.id ?? '',
      serviceId: initialData?.service?.id ?? '',
      statusId: initialData?.status?.id ?? '',
      startsAt: initialData?.startsAt ?? '',
      endsAt: initialData?.endsAt ?? '',
      notes: initialData?.notes ?? '',
      price: initialData?.price ?? '',
    },
  });

  const onSubmit = async (data: CreateAppointmentSchema) => {
    try {
      form.clearErrors('root');

      const payload = {
        ...data,
        notes: data.notes || undefined,
        price: data.price || undefined,
      };

      if (isEditing) {
        await updateAppointment.mutateAsync({ id: initialData.id, data: payload });
        toast.success(
          t('appointment.edit.success', 'Cita actualizada con éxito'),
        );
      } else {
        await createAppointment.mutateAsync(payload);
        toast.success(
          t('appointment.create.success', 'Cita creada con éxito'),
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
