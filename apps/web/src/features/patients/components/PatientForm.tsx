'use client';

import { usePatientForm } from '../hooks/usePatientForm';
import {
  Button,
  Input,
  Alert,
  FormField,
  cn,
  Textarea,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  DatePicker,
} from '@repo/ui';
import { Controller } from 'react-hook-form';
import { parseISO } from 'date-fns';
import { useBranchesQuery } from '@/features/branches/hooks/useBranchesQuery';
import type { Patient } from '../types';


interface PatientFormProps {
  initialData?: Patient;
  onSuccess?: () => void;
  className?: string;
}

export function PatientForm({
  initialData,
  onSuccess,
  className,
}: PatientFormProps) {
  const { form, onSubmit, isSubmitting, isDirty, isEditing, t } = usePatientForm({
    initialData,
    onSuccess,
  });
  const {
    register,
    control,
    formState: { errors },
  } = form;

  const { data: branchesData } = useBranchesQuery();
  const branches = branchesData?.data?.items ?? [];

  return (
    <form onSubmit={onSubmit} className={cn('grid gap-4', className)}>
      {errors.root && <Alert.error>{errors.root.message}</Alert.error>}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField
          label={t('patient.form.fields.firstName.label', 'First Name')}
          required
          htmlFor="firstName"
          error={errors.firstName?.message ? t(errors.firstName.message) : undefined}
        >
          <Input
            id="firstName"
            {...register('firstName')}
            placeholder={t('patient.form.fields.firstName.placeholder', 'John')}
          />
        </FormField>

        <FormField
          label={t('patient.form.fields.lastName.label', 'Last Name')}
          required
          htmlFor="lastName"
          error={errors.lastName?.message ? t(errors.lastName.message) : undefined}
        >
          <Input
            id="lastName"
            {...register('lastName')}
            placeholder={t('patient.form.fields.lastName.placeholder', 'Doe')}
          />
        </FormField>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField
          label={t('patient.form.fields.secondName.label', 'Second Name')}
          htmlFor="secondName"
          error={errors.secondName?.message ? t(errors.secondName.message) : undefined}
        >
          <Input
            id="secondName"
            {...register('secondName')}
            placeholder={t('patient.form.fields.secondName.placeholder', 'Alexander')}
          />
        </FormField>

        <FormField
          label={t('patient.form.fields.secondLastName.label', 'Second Last Name')}
          htmlFor="secondLastName"
          error={errors.secondLastName?.message ? t(errors.secondLastName.message) : undefined}
        >
          <Input
            id="secondLastName"
            {...register('secondLastName')}
            placeholder={t('patient.form.fields.secondLastName.placeholder', 'Smith')}
          />
        </FormField>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField
          label={t('patient.form.fields.email.label', 'Email')}
          htmlFor="email"
          error={errors.email?.message ? t(errors.email.message) : undefined}
        >
          <Input
            id="email"
            {...register('email')}
            type="email"
            placeholder={t('patient.form.fields.email.placeholder', 'john.doe@example.com')}
          />
        </FormField>

        <FormField
          label={t('patient.form.fields.phone.label', 'Phone')}
          required
          htmlFor="phone"
          error={errors.phone?.message ? t(errors.phone.message) : undefined}
        >
          <Input
            id="phone"
            {...register('phone')}
            placeholder={t('patient.form.fields.phone.placeholder', '+1 234 567 890')}
          />
        </FormField>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <FormField
          label={t('patient.form.fields.idNumber.label', 'ID Number')}
          htmlFor="idNumber"
          error={errors.idNumber?.message ? t(errors.idNumber.message) : undefined}
        >
          <Input
            id="idNumber"
            {...register('idNumber')}
            placeholder="123-456789-0000A"
          />
        </FormField>

        <FormField
          label={t('patient.form.fields.dateOfBirth.label', 'Date of Birth')}
          htmlFor="dateOfBirth"
          error={
            errors.dateOfBirth?.message
              ? t(errors.dateOfBirth.message)
              : undefined
          }
        >
          <Controller
            control={control}
            name="dateOfBirth"
            render={({ field }) => (
              <DatePicker
                value={field.value ? parseISO(field.value) : undefined}
                onChange={(date) => field.onChange(date?.toISOString())}
                placeholder={t(
                  'patient.form.fields.dateOfBirth.placeholder',
                  'Select date',
                )}
              />
            )}
          />
        </FormField>

        <FormField
          label={t('patient.form.fields.gender.label', 'Gender')}
          htmlFor="gender"
          error={errors.gender?.message ? t(errors.gender.message) : undefined}
        >
          <Controller
            control={control}
            name="gender"
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value || ''}>
                <SelectTrigger id="gender" className="w-full">
                  <SelectValue
                    placeholder={t('common.select.placeholder', 'Select...')}
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MALE">
                    {t('patient.form.fields.gender.options.male', 'Male')}
                  </SelectItem>
                  <SelectItem value="FEMALE">
                    {t('patient.form.fields.gender.options.female', 'Female')}
                  </SelectItem>
                  <SelectItem value="OTHER">
                    {t('patient.form.fields.gender.options.other', 'Other')}
                  </SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </FormField>
      </div>

      <FormField
        label={t('patient.form.fields.primaryBranchId.label', 'Primary Branch')}
        htmlFor="primaryBranchId"
        error={
          errors.primaryBranchId?.message
            ? t(errors.primaryBranchId.message)
            : undefined
        }
      >
        <Controller
          control={control}
          name="primaryBranchId"
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value || ''}>
              <SelectTrigger id="primaryBranchId" className="w-full">
                <SelectValue
                  placeholder={t(
                    'common.select.placeholder',
                    'Select a branch...',
                  )}
                />
              </SelectTrigger>
              <SelectContent>
                {branches.map((branch) => (
                  <SelectItem key={branch.id} value={branch.id}>
                    {branch.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </FormField>


      <FormField
        label={t('patient.form.fields.address.label', 'Address')}
        htmlFor="address"
        error={errors.address?.message ? t(errors.address.message) : undefined}
      >
        <Textarea
          id="address"
          {...register('address')}
          placeholder={t('patient.form.fields.address.placeholder', 'Full address...')}
        />
      </FormField>

      <FormField
        label={t('patient.form.fields.medicalNotes.label', 'Medical Notes')}
        htmlFor="medicalNotes"
        error={errors.medicalNotes?.message ? t(errors.medicalNotes.message) : undefined}
      >
        <Textarea
          id="medicalNotes"
          {...register('medicalNotes')}
          placeholder={t('patient.form.fields.medicalNotes.placeholder', 'Allergies, conditions, etc...')}
        />
      </FormField>

      <Button
        type="submit"
        className="w-full"
        isLoading={isSubmitting}
        disabled={isEditing && !isDirty}
      >
        {isEditing
          ? t('patient.form.submitEdit', 'Update Patient')
          : t('patient.form.submit', 'Create Patient')}
      </Button>
    </form>
  );
}
