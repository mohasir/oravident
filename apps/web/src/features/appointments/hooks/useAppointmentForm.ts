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
import { set, format, parseISO } from 'date-fns';
import { useAppointmentFormData } from './useAppointmentFormData';
import { isAppointmentDateDisabled, getScheduleForDate, getDefaultDates } from '../helpers';

interface UseAppointmentFormProps {
  initialData?: Appointment;
  initialDate?: Date;
  onSuccess?: () => void;
}


export function useAppointmentForm({
  initialData,
  initialDate,
  onSuccess,
}: UseAppointmentFormProps = {}) {
  const { t } = useTranslation('admin');
  const parseError = useApiErrorParser();
  const createAppointment = useMutationCreateAppointment();
  const updateAppointment = useMutationUpdateAppointment();

  const isEditing = !!initialData;
  const { startsAt: defaultStartsAt, endsAt: defaultEndsAt } =
    getDefaultDates(initialDate);

  const { branches, patients, doctors, services, statuses } = useAppointmentFormData();

  const form = useForm<CreateAppointmentSchema>({
    resolver: zodResolver(createAppointmentSchema),
    defaultValues: {
      branchId: initialData?.branch?.id ?? '',
      patientId: initialData?.patient?.id ?? '',
      workerId: initialData?.worker?.id ?? '',
      serviceId: initialData?.service?.id ?? '',
      statusId: initialData?.status?.id ?? '',
      startsAt: initialData?.startsAt ?? defaultStartsAt,
      endsAt: initialData?.endsAt ?? defaultEndsAt,
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

  const branchId = form.watch('branchId');
  const startsAt = form.watch('startsAt');
  const endsAt = form.watch('endsAt');
  const selectedBranch = branches.find((b) => b.id === branchId);
  const selectedDateSchedule = getScheduleForDate(startsAt, selectedBranch);

  const isDateDisabled = (date: Date) => isAppointmentDateDisabled(date, selectedBranch);
  const isTimeDisabled = !branchId || !startsAt;

  const handleDateChange = (date: Date | undefined, fieldName: 'startsAt' | 'endsAt') => {
    if (!date) return;
    const currentVal = form.getValues(fieldName);
    const currentTime = currentVal ? format(parseISO(currentVal), 'HH:mm') : '09:00';
    const [hours, minutes] = currentTime.split(':').map(Number);
    form.setValue(fieldName, set(date, { hours, minutes, seconds: 0, milliseconds: 0 }).toISOString());
  };

  const handleTimeChange = (time: string, fieldName: 'startsAt' | 'endsAt') => {
    const currentVal = form.getValues(fieldName);
    const currentDate = currentVal ? parseISO(currentVal) : new Date();
    const [hours, minutes] = time.split(':').map(Number);
    form.setValue(fieldName, set(currentDate, { hours, minutes, seconds: 0, milliseconds: 0 }).toISOString());
  };

  return {
    form,
    onSubmit: form.handleSubmit(onSubmit),
    isSubmitting: form.formState.isSubmitting,
    isDirty: form.formState.isDirty,
    isEditing,
    t,
    branches,
    patients,
    doctors,
    services,
    statuses,
    isDateDisabled,
    scheduleMin: selectedDateSchedule?.openTime,
    scheduleMax: selectedDateSchedule?.closeTime,
    isTimeDisabled,
    startsAt,
    endsAt,
    handleDateChange,
    handleTimeChange,
  };
}
