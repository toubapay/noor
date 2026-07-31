import { useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useMutation } from '@tanstack/react-query';
import * as api from '@/api/endpoints';
import { showApiError, toast } from '@/utils/toast';

interface FormValues {
  password: string;
  confirmPassword: string;
}

export default function ResetPasswordPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const resetToken = (location.state as { resetToken?: string })?.resetToken || '';
  const { register, handleSubmit, watch, formState: { errors } } = useForm<FormValues>();

  const mutation = useMutation({
    mutationFn: (values: FormValues) =>
      api.resetPassword({ reset_token: resetToken, password: values.password, confirm_password: values.confirmPassword }),
    onSuccess: () => {
      toast.success('Password reset. Please log in.');
      navigate('/auth/login', { replace: true });
    },
    onError: (err) => showApiError(err, 'Could not reset password'),
  });

  return (
    <form onSubmit={handleSubmit((v) => mutation.mutate(v))} className="flex flex-col gap-3">
      <input
        type="password"
        placeholder={t('password')}
        className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm"
        {...register('password', { required: true, minLength: 6 })}
      />
      <input
        type="password"
        placeholder={t('confirm_password')}
        className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm"
        {...register('confirmPassword', {
          required: true,
          validate: (v) => v === watch('password') || 'Passwords do not match',
        })}
      />
      {errors.confirmPassword && <p className="text-xs text-red-500">{errors.confirmPassword.message}</p>}
      <button
        type="submit"
        disabled={mutation.isPending}
        className="rounded-lg bg-primary py-2.5 text-sm font-medium text-white disabled:opacity-60"
      >
        {t('reset_password')}
      </button>
    </form>
  );
}
