import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { forgotPasswordSchema, type ForgotPasswordSchema } from '@/features/auth/schemas/forgotPassword.schema';
import { authService } from '@/features/auth/services/auth.service';

export function useForgotPasswordForm() {
  const { t } = useTranslation('admin');
  const [emailSent, setEmailSent] = useState(false);

  const form = useForm<ForgotPasswordSchema>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  const onSubmit = async (data: ForgotPasswordSchema) => {
    try {
      form.clearErrors('root');
      await authService.forgotPassword(data);
      setEmailSent(true);
    } catch {
      form.setError('root', {
        message: t('auth.forgotPassword.errors.generic', 'Algo salió mal, intenta de nuevo'),
      });
    }
  };

  return {
    form,
    onSubmit: form.handleSubmit(onSubmit),
    register: form.register,
    errors: form.formState.errors,
    isSubmitting: form.formState.isSubmitting,
    emailSent,
    t,
  };
}
