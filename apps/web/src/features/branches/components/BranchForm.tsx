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

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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

          <FormField
            label={t('branch.form.fields.color.label', 'Color')}
            htmlFor="color"
            error={errors.color?.message ? t(errors.color.message) : undefined}
          >
            <div className="flex gap-2">
              <Input
                id="color"
                {...register('color')}
                type="color"
                className="w-12 p-1 h-10"
              />
              <Input
                value={form.watch('color')}
                onChange={(e) => form.setValue('color', e.target.value)}
                placeholder="#000000"
                className="flex-1"
              />
            </div>
          </FormField>
        </div>

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
