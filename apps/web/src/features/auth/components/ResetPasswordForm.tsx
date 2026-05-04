'use client';

import { Alert, Button, PasswordInput, FormField } from '@repo/ui';
import { useResetPasswordForm } from '@/features/auth/hooks/useResetPasswordForm';

export function ResetPasswordForm() {
  const { register, onSubmit, errors, isSubmitting, token, t } =
    useResetPasswordForm();

  if (!token) {
    return (
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-primary">
          {t('auth.resetPassword.invalidTitle')}
        </h1>
        <p className="text-sm text-muted-foreground">
          {t('auth.resetPassword.invalidDescription')}
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <div className="space-y-1 mb-4">
        <h1 className="text-2xl font-bold text-primary">
          {t('auth.resetPassword.title')}
        </h1>
        <p className="text-sm text-muted-foreground">
          {t('auth.resetPassword.description')}
        </p>
      </div>

      {/* Form */}
      <form className="space-y-5" onSubmit={onSubmit} noValidate>
        {errors.root && <Alert.error>{errors.root.message}</Alert.error>}

        <FormField
          label={t('auth.resetPassword.passwordLabel')}
          required
          htmlFor="password"
          error={
            errors.password?.message ? t(errors.password.message) : undefined
          }
        >
          <PasswordInput
            id="password"
            placeholder={t('auth.resetPassword.passwordPlaceholder')}
            required
            aria-invalid={!!errors.password}
            {...register('password')}
          />
        </FormField>

        <FormField
          label={t('auth.resetPassword.confirmPasswordLabel')}
          required
          htmlFor="confirmPassword"
          error={
            errors.confirmPassword?.message
              ? t(errors.confirmPassword.message)
              : undefined
          }
        >
          <PasswordInput
            id="confirmPassword"
            placeholder={t('auth.resetPassword.confirmPasswordPlaceholder')}
            required
            aria-invalid={!!errors.confirmPassword}
            {...register('confirmPassword')}
          />
        </FormField>

        <Button
          className="mt-10"
          type="submit"
          fullWidth
          disabled={isSubmitting}
        >
          {t('auth.resetPassword.submitButton')}
        </Button>
      </form>
    </>
  );
}
