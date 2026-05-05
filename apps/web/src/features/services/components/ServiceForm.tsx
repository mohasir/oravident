'use client';

import { useServiceForm } from '../hooks/useServiceForm';
import { Button, Input, Alert, FormField, cn, Textarea } from '@repo/ui';
import type { Service } from '../types';

interface ServiceFormProps {
  initialData?: Service;
  onSuccess?: () => void;
  className?: string;
}

export function ServiceForm({
  initialData,
  onSuccess,
  className,
}: ServiceFormProps) {
  const { form, onSubmit, isSubmitting, isDirty, isEditing, t } = useServiceForm({
    initialData,
    onSuccess,
  });
  const {
    register,
    formState: { errors },
  } = form;

  return (
    <form onSubmit={onSubmit} className={cn('grid gap-4', className)}>
      {errors.root && <Alert.error>{errors.root.message}</Alert.error>}

      <FormField
        label={t('service.form.fields.name.label', 'Name')}
        required
        htmlFor="name"
        error={errors.name?.message ? t(errors.name.message) : undefined}
      >
        <Input
          id="name"
          {...register('name')}
          placeholder={t('service.form.fields.name.placeholder', 'Dental Cleaning')}
        />
      </FormField>

      <FormField
        label={t('service.form.fields.description.label', 'Description (Optional)')}
        htmlFor="description"
        error={errors.description?.message ? t(errors.description.message) : undefined}
      >
        <Textarea
          id="description"
          {...register('description')}
          placeholder={t(
            'service.form.fields.description.placeholder',
            'Full professional dental cleaning and polishing...',
          )}
        />
      </FormField>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField
          label={t('service.form.fields.durationMinutes.label', 'Duration (Minutes)')}
          required
          htmlFor="durationMinutes"
          error={errors.durationMinutes?.message ? t(errors.durationMinutes.message) : undefined}
        >
          <Input
            id="durationMinutes"
            {...register('durationMinutes', { valueAsNumber: true })}
            type="number"
            placeholder="30"
          />
        </FormField>

        <FormField
          label={t('service.form.fields.price.label', 'Price (Optional)')}
          htmlFor="price"
          error={errors.price?.message ? t(errors.price.message) : undefined}
        >
          <Input
            id="price"
            {...register('price')}
            placeholder="0.00"
          />
        </FormField>
      </div>

      <Button
        type="submit"
        className="w-full"
        isLoading={isSubmitting}
        disabled={isEditing && !isDirty}
      >
        {isEditing
          ? t('service.form.submitEdit', 'Update Service')
          : t('service.form.submit', 'Create Service')}
      </Button>
    </form>
  );
}
