import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { useRouter, useSearchParams } from 'next/navigation';
import { resetPasswordSchema, type ResetPasswordSchema } from '../schemas/resetPassword.schema';
import { DEFAULT_REDIRECT_LOGIN } from '@/lib/auth/navigation';
import type { Route } from 'next';

export function useResetPasswordForm() {
  const { t } = useTranslation('auth');
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token') ?? '';

  const form = useForm<ResetPasswordSchema>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: '', confirmPassword: '' },
  });

  const onSubmit = async (_data: ResetPasswordSchema) => {
    try {
      form.clearErrors('root');
      // TODO: call API with token and new password
      router.replace(DEFAULT_REDIRECT_LOGIN as Route);
    } catch {
      form.setError('root', {
        message: t('resetPassword.errors.generic', 'Algo salió mal, intenta de nuevo'),
      });
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
