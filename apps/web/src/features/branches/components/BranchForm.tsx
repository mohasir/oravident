'use client';

import { useBranchForm } from '@/features/branches/hooks/useBranchForm';
import { Button, Input, Alert, FormField, cn } from '@repo/ui';
import { FormProvider } from 'react-hook-form';
import type { Branch } from '@/features/branches/types';

interface BranchFormProps {
  initialData?: Branch;
  onSuccess?: () => void;
  className?: string;
}

import { BranchScheduleFields } from './BranchScheduleFields';
import { BRANCH_COLORS } from '@/features/branches/constants';

export function BranchForm({
  initialData,
  onSuccess,
  className,
}: BranchFormProps) {
  const { form, onSubmit, isSubmitting, isEditing, t } = useBranchForm({
    initialData,
    onSuccess,
  });
  const {
    register,
    formState: { errors },
  } = form;

  return (
    <FormProvider {...form}>
      <form onSubmit={onSubmit} className={cn('space-y-6', className)}>
        {errors.root && <Alert.error>{errors.root.message}</Alert.error>}

        <div className="grid grid-cols-1 gap-4">
          <FormField
            label={t('branch.form.fields.name.label', 'Name')}
            required
            htmlFor="name"
            error={errors.name?.message ? t(errors.name.message) : undefined}
          >
            <Input
              id="name"
              {...register('name')}
              placeholder={t(
                'branch.form.fields.name.placeholder',
                'Main Branch',
              )}
            />
          </FormField>
        </div>

        <FormField
          label={t('branch.form.fields.address.label', 'Address')}
          required
          htmlFor="address"
          error={
            errors.address?.message ? t(errors.address.message) : undefined
          }
        >
          <Input
            id="address"
            {...register('address')}
            placeholder={t(
              'branch.form.fields.address.placeholder',
              '123 Main St, City',
            )}
          />
        </FormField>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            label={t('branch.form.fields.email.label', 'Email (Optional)')}
            htmlFor="email"
            error={errors.email?.message ? t(errors.email.message) : undefined}
          >
            <Input
              id="email"
              {...register('email')}
              type="email"
              placeholder={t(
                'branch.form.fields.email.placeholder',
                'branch@example.com',
              )}
            />
          </FormField>

          <FormField
            label={t('branch.form.fields.phone.label', 'Phone (Optional)')}
            htmlFor="phone"
            error={errors.phone?.message ? t(errors.phone.message) : undefined}
          >
            <Input
              id="phone"
              {...register('phone')}
              placeholder={t(
                'branch.form.fields.phone.placeholder',
                '+1 234 567 890',
              )}
            />
          </FormField>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            label={t('branch.form.fields.latitude.label', 'Latitude')}
            htmlFor="latitude"
            error={
              errors.latitude?.message ? t(errors.latitude.message) : undefined
            }
          >
            <Input
              id="latitude"
              {...register('latitude')}
              placeholder="0.0000"
            />
          </FormField>

          <FormField
            label={t('branch.form.fields.longitude.label', 'Longitude')}
            htmlFor="longitude"
            error={
              errors.longitude?.message
                ? t(errors.longitude.message)
                : undefined
            }
          >
            <Input
              id="longitude"
              {...register('longitude')}
              placeholder="0.0000"
            />
          </FormField>
        </div>

        <FormField
          label={t('branch.form.fields.color.label', 'Color')}
          htmlFor="color"
          error={errors.color?.message ? t(errors.color.message) : undefined}
        >
          <div className="flex flex-wrap gap-2 pt-1">
            {BRANCH_COLORS.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() =>
                  form.setValue('color', color, { shouldValidate: true })
                }
                className={cn(
                  'w-8 h-8 rounded-full border-2 transition-all hover:scale-110',
                  form.watch('color') === color
                    ? 'border-gray-700 ring-2 ring-offset-2 ring-gray-400 scale-110'
                    : 'border-transparent',
                )}
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
          </div>
        </FormField>

        <BranchScheduleFields />

        <div className="flex justify-end gap-4 pt-4 border-t">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting
              ? t('common.saving', 'Saving...')
              : isEditing
                ? t('branch.form.submitEdit', 'Update branch')
                : t('branch.form.submit', 'Create branch')}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
