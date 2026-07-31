import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useMutation } from '@tanstack/react-query';
import * as api from '@/api/endpoints';
import { useAppDispatch } from '@/store/hooks';
import { setToken } from '@/store/slices/authSlice';
import { showApiError } from '@/utils/toast';

interface FormValues {
  fName: string;
  lName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

export default function RegisterPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { register, handleSubmit, watch, formState: { errors } } = useForm<FormValues>();

  const registerMutation = useMutation({
    mutationFn: (values: FormValues) =>
      api.register({
        f_name: values.fName,
        l_name: values.lName,
        email: values.email,
        phone: values.phone,
        password: values.password,
        confirm_password: values.confirmPassword,
      }),
    onSuccess: (data) => {
      dispatch(setToken(data.token));
      navigate('/', { replace: true });
    },
    onError: (err) => showApiError(err, 'Registration failed'),
  });

  return (
    <form onSubmit={handleSubmit((v) => registerMutation.mutate(v))} className="flex flex-col gap-3">
      <div className="flex gap-2">
        <input
          placeholder={t('first_name')}
          className="w-1/2 rounded-lg border border-gray-200 px-4 py-2.5 text-sm"
          {...register('fName', { required: true })}
        />
        <input
          placeholder={t('last_name')}
          className="w-1/2 rounded-lg border border-gray-200 px-4 py-2.5 text-sm"
          {...register('lName', { required: true })}
        />
      </div>
      <input
        type="email"
        placeholder="Email"
        className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm"
        {...register('email', { required: true })}
      />
      <input
        type="tel"
        placeholder={t('phone')}
        className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm"
        {...register('phone', { required: true })}
      />
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
        disabled={registerMutation.isPending}
        className="rounded-lg bg-primary py-2.5 text-sm font-medium text-white disabled:opacity-60"
      >
        {t('register')}
      </button>
      <p className="text-center text-sm text-gray-500">
        {t('already_have_account')}{' '}
        <Link to="/auth/login" className="font-medium text-primary">
          {t('login')}
        </Link>
      </p>
    </form>
  );
}
