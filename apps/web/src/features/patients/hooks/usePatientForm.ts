'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import {
  useMutationCreatePatient,
  useMutationUpdatePatient,
} from './usePatientsQuery';
import {
  createPatientSchema,
  type CreatePatientSchema,
} from '../schemas/patient.schema';
import { toast } from '@repo/ui';
import type { Patient } from '../types';
import { useApiErrorParser } from '@/lib/http/useApiErrorParser';

interface UsePatientFormProps {
  initialData?: Patient;
  onSuccess?: () => void;
}

export function usePatientForm({
  initialData,
  onSuccess,
}: UsePatientFormProps = {}) {
  const { t } = useTranslation('admin');
  const parseError = useApiErrorParser();
  const createPatient = useMutationCreatePatient();
  const updatePatient = useMutationUpdatePatient();

  const isEditing = !!initialData;

  const form = useForm<CreatePatientSchema>({
    resolver: zodResolver(createPatientSchema),
    defaultValues: {
      firstName: initialData?.firstName ?? '',
      secondName: initialData?.secondName ?? '',
      lastName: initialData?.lastName ?? '',
      secondLastName: initialData?.secondLastName ?? '',
      idNumber: initialData?.idNumber ?? '',
      email: initialData?.email ?? '',
      phone: initialData?.phone ?? '',
      dateOfBirth: initialData?.dateOfBirth ?? '',
      gender: initialData?.gender ?? undefined,
      address: initialData?.address ?? '',
      medicalNotes: initialData?.medicalNotes ?? '',
      primaryBranchId: initialData?.primaryBranchId ?? '',
    },
  });

  const onSubmit = async (data: CreatePatientSchema) => {
    try {
      form.clearErrors('root');

      const payload = {
        ...data,
        secondName: data.secondName || undefined,
        secondLastName: data.secondLastName || undefined,
        idNumber: data.idNumber || undefined,
        email: data.email || undefined,
        dateOfBirth: data.dateOfBirth || undefined,
        address: data.address || undefined,
        medicalNotes: data.medicalNotes || undefined,
        primaryBranchId: data.primaryBranchId || undefined,
      };

      if (isEditing) {
        await updatePatient.mutateAsync({ id: initialData.id, data: payload });
        toast.success(
          t('patient.edit.success', 'Patient updated successfully'),
        );
      } else {
        await createPatient.mutateAsync(payload);
        toast.success(
          t('patient.create.success', 'Patient created successfully'),
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
