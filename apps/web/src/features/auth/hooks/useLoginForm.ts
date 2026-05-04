import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
// import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  loginSchema,
  type LoginSchema,
} from '@/features/auth/schemas/login.schema';
import { DEFAULT_REDIRECT_HOME } from '@/lib/auth/navigation';
import type { Route } from 'next';

export function useLoginForm() {
  const { t } = useTranslation('admin');
  const router = useRouter();
  const searchParams = useSearchParams();

  const callbackUrl = searchParams?.get('callbackUrl');
  const prefilledEmail =
    searchParams?.get('email') || searchParams?.get('usernameOrEmail') || '';

  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: prefilledEmail,
      password: '',
      remember: false,
    },
  });

  const onSubmit = async (data: LoginSchema) => {
    try {
      form.clearErrors('root');

      /* const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        if (result.error === 'unauthorized') {
          form.setError('root', { message: t('login.errors.unauthorized', 'No autorizado') });
        } else {
          form.setError('root', { message: result.error });
        }
        return;
      }

      if (callbackUrl && callbackUrl.trim() !== '') {
        router.replace(callbackUrl as Route);
      } else {
        router.replace(DEFAULT_REDIRECT_HOME);
      } */
    } catch (e) {
      form.setError('root', {
        message: t(
          'auth.login.errors.generic',
          'Algo salió mal, intenta de nuevo',
        ),
      });
    }
  };

  return {
    form,
    onSubmit: form.handleSubmit(onSubmit),
    register: form.register,
    errors: form.formState.errors,
    isSubmitting: form.formState.isSubmitting,
    t,
  };
}
