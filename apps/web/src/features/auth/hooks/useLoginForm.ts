import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/auth/hook/useAuth';
import {
  loginSchema,
  type LoginSchema,
} from '@/features/auth/schemas/login.schema';
import { DEFAULT_REDIRECT_HOME } from '@/lib/auth/navigation';
import type { Route } from 'next';

export function useLoginForm() {
  const { t } = useTranslation('admin');
  const { signIn } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const callbackUrl = searchParams?.get('callbackUrl') ?? undefined;
  const prefilledEmail =
    searchParams?.get('email') || searchParams?.get('usernameOrEmail') || '';

  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: prefilledEmail,
      remember: false,
    },
  });

  const onSubmit = async (data: LoginSchema) => {
    try {
      form.clearErrors('root');
      await signIn(data);
      const destination = callbackUrl?.startsWith('/')
        ? callbackUrl
        : DEFAULT_REDIRECT_HOME;

      console.log({ destination });

      router.replace(destination as Route);
    } catch (e: any) {
      const isUnauthorized = e.response?.status === 401;
      form.setError('root', {
        message: isUnauthorized
          ? t('login.errors.unauthorized', 'Unauthorized')
          : t(
              'auth.login.errors.generic',
              'Something went wrong, please try again',
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
