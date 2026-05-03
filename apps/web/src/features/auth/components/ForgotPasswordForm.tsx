'use client';

import Link from 'next/link';
import { Alert, Button, Input, FormField } from '@repo/ui';
import { useForgotPasswordForm } from '../hooks/useForgotPasswordForm';

export function ForgotPasswordForm() {
  const { register, onSubmit, errors, isSubmitting, emailSent, t } =
    useForgotPasswordForm();

  if (emailSent) {
    return (
      <>
        <div className="space-y-1 mb-4">
          <h1 className="text-2xl font-bold text-primary">
            {t('forgotPassword.successTitle')}
          </h1>
          <p className="text-sm text-muted-foreground">
            {t('forgotPassword.successDescription')}
          </p>
        </div>
        <Button
          asChild
          variant="link"
          color="primary"
          className="px-0 py-0 h-auto text-sm font-medium"
        >
          <Link href="/login">{t('forgotPassword.backToLogin')}</Link>
        </Button>
      </>
    );
  }

  return (
    <>
      {/* Header */}
      <div className="space-y-1 mb-4">
        <h1 className="text-2xl font-bold text-primary">
          {t('forgotPassword.title')}
        </h1>
        <p className="text-sm text-muted-foreground">
          {t('forgotPassword.description')}
        </p>
      </div>

      {/* Form */}
      <form className="space-y-5" onSubmit={onSubmit} noValidate>
        {errors.root && <Alert.error>{errors.root.message}</Alert.error>}

        <FormField
          label={t('forgotPassword.emailLabel')}
          required
          htmlFor="email"
          error={errors.email?.message ? t(errors.email.message) : undefined}
        >
          <Input
            id="email"
            type="email"
            placeholder={t('forgotPassword.emailPlaceholder')}
            required
            aria-invalid={!!errors.email}
            {...register('email')}
          />
        </FormField>

        <Button
          className="mt-10"
          type="submit"
          fullWidth
          disabled={isSubmitting}
        >
          {t('forgotPassword.submitButton')}
        </Button>
      </form>

      <div className="mt-4 text-center">
        <Button
          asChild
          variant="link"
          color="primary"
          className="px-0 py-0 h-auto text-sm font-medium"
        >
          <Link href="/login">{t('forgotPassword.backToLogin')}</Link>
        </Button>
      </div>
    </>
  );
}
