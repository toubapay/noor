import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useMutation } from '@tanstack/react-query';
import * as api from '@/api/endpoints';
import { showApiError, toast } from '@/utils/toast';

export default function ForgotPasswordPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const { register, handleSubmit } = useForm<{ emailOrPhone: string }>();

  const mutation = useMutation({
    mutationFn: (value: string) => api.forgotPassword(value),
    onSuccess: (_data, value) => {
      toast.success('OTP sent');
      navigate('/auth/verify-otp', { state: { emailOrPhone: value } });
    },
    onError: (err) => showApiError(err, 'Could not send reset code'),
  });

  return (
    <form
      onSubmit={handleSubmit((v) => {
        setEmailOrPhone(v.emailOrPhone);
        mutation.mutate(v.emailOrPhone);
      })}
      className="flex flex-col gap-3"
    >
      <p className="text-sm text-gray-500">
        Enter the email or phone associated with your account and we'll send you a verification code.
      </p>
      <input
        defaultValue={emailOrPhone}
        placeholder={t('email_or_phone')}
        className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm"
        {...register('emailOrPhone', { required: true })}
      />
      <button
        type="submit"
        disabled={mutation.isPending}
        className="rounded-lg bg-primary py-2.5 text-sm font-medium text-white disabled:opacity-60"
      >
        Send code
      </button>
    </form>
  );
}
