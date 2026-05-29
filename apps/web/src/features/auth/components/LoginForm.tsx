'use client';

import Link from 'next/link';
import { Controller } from 'react-hook-form';
import {
  Alert,
  Button,
  Input,
  PasswordInput,
  Checkbox,
  FormField,
} from '@repo/ui';
import { useLoginForm } from '@/features/auth/hooks/useLoginForm';

export function LoginForm() {
  const { form, register, onSubmit, errors, isSubmitting, t } = useLoginForm();

  return (
    <>
      {/* Header */}
      <div className="space-y-1 mb-4">
        <h1 className="text-2xl font-bold text-primary">{t('auth.login.title')}</h1>
        <p className="text-sm text-muted-foreground">
          {t('auth.login.description')}
        </p>
      </div>

      {/* Form */}
      <form className="space-y-5" onSubmit={onSubmit} noValidate>
        {errors.root && <Alert.error>{errors.root.message}</Alert.error>}

        {/* Email */}
        <FormField
          label={t('auth.login.emailLabel')}
          required
          htmlFor="email"
          error={errors.email?.message ? t(errors.email.message) : undefined}
        >
          <Input
            id="email"
            type="email"
            placeholder={t('auth.login.emailPlaceholder')}
            required
            aria-invalid={!!errors.email}
            {...register('email')}
          />
        </FormField>

        <FormField
          label={t('auth.login.passwordLabel')}
          required
          htmlFor="password"
          error={
            errors.password?.message ? t(errors.password.message) : undefined
          }
        >
          <PasswordInput
            id="password"
            placeholder={t('auth.login.passwordPlaceholder')}
            required
            aria-invalid={!!errors.password}
            {...register('password')}
          />
        </FormField>

        {/* Remember me + Forgot password */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Controller
              control={form.control}
              name="remember"
              render={({ field }) => (
                <Checkbox
                  id="remember"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              )}
            />
            <label
              htmlFor="remember"
              className="text-sm cursor-pointer select-none text-primary"
            >
              {t('auth.login.rememberMe')}
            </label>
          </div>

          <Button
            asChild
            variant="link"
            color="primary"
            className="text-sm px-0 py-0 h-auto font-medium"
          >
            <Link href="/forgot-password">{t('auth.login.forgotPassword')}</Link>
          </Button>
        </div>

        {/* Submit */}
        <Button className="mt-10" type="submit" fullWidth isLoading={isSubmitting}>
          {t('auth.login.submitButton')}
        </Button>
      </form>
    </>
  );
}
