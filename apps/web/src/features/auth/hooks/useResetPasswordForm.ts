import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { useRouter, useSearchParams } from 'next/navigation';
import { resetPasswordSchema, type ResetPasswordSchema } from '@/features/auth/schemas/resetPassword.schema';
import { authService } from '@/features/auth/services/auth.service';
import { DEFAULT_REDIRECT_LOGIN } from '@/lib/auth/navigation';
import type { Route } from 'next';
import { useApiErrorParser } from '@/lib/http/useApiErrorParser';

export function useResetPasswordForm() {
  const { t } = useTranslation('admin');
  const parseError = useApiErrorParser();
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams?.get('token') ?? '';

  const form = useForm<ResetPasswordSchema>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: '', confirmPassword: '' },
  });

  const onSubmit = async (data: ResetPasswordSchema) => {
    try {
      form.clearErrors('root');
      await authService.resetPassword({ ...data, token });
      router.replace(DEFAULT_REDIRECT_LOGIN as Route);
    } catch (e) {
      parseError(e, (message) => form.setError('root', { message }));
    }
  };

  return {
    form,
    onSubmit: form.handleSubmit(onSubmit),
    register: form.register,
    errors: form.formState.errors,
    isSubmitting: form.formState.isSubmitting,
    token,
    t,
  };
}
