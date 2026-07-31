import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useMutation } from '@tanstack/react-query';
import * as api from '@/api/endpoints';
import { signInWithGoogle, signInWithFacebook, signInWithApple } from '@/firebase/socialAuth';
import { useAppDispatch } from '@/store/hooks';
import { setToken, setUser, setGuest } from '@/store/slices/authSlice';
import { showApiError, toast } from '@/utils/toast';

interface FormValues {
  emailOrPhone: string;
  password: string;
}

export default function LoginPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>();
  const [socialLoading, setSocialLoading] = useState<string | null>(null);

  const redirectTo = (location.state as { from?: Location })?.from?.pathname || '/';

  const loginMutation = useMutation({
    mutationFn: (values: FormValues) => api.login({ email_or_phone: values.emailOrPhone, password: values.password }),
    onSuccess: (data) => {
      dispatch(setToken(data.token));
      navigate(redirectTo, { replace: true });
    },
    onError: (err) => showApiError(err, 'Login failed'),
  });

  const onSubmit = (values: FormValues) => loginMutation.mutate(values);

  const handleSocial = async (medium: 'google' | 'facebook' | 'apple') => {
    setSocialLoading(medium);
    try {
      const signIn = medium === 'google' ? signInWithGoogle : medium === 'facebook' ? signInWithFacebook : signInWithApple;
      const result = await signIn();
      const data = await api.socialLogin({
        unique_id: result.uniqueId,
        email: result.email ?? undefined,
        medium: result.medium,
        token: result.idToken,
      });
      dispatch(setToken(data.token));
      navigate(redirectTo, { replace: true });
    } catch (err) {
      showApiError(err, `${medium} sign-in failed`);
    } finally {
      setSocialLoading(null);
    }
  };

  const continueAsGuest = () => {
    dispatch(setGuest(true));
    dispatch(setUser(null));
    toast.success(t('continue_as_guest'));
    navigate('/', { replace: true });
  };

  return (
    <div className="flex flex-col gap-4">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
        <div>
          <input
            type="text"
            placeholder={t('email_or_phone')}
            className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm"
            {...register('emailOrPhone', { required: true })}
          />
          {errors.emailOrPhone && <p className="mt-1 text-xs text-red-500">{t('email_or_phone')} is required</p>}
        </div>
        <div>
          <input
            type="password"
            placeholder={t('password')}
            className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm"
            {...register('password', { required: true })}
          />
          {errors.password && <p className="mt-1 text-xs text-red-500">{t('password')} is required</p>}
        </div>
        <Link to="/auth/forgot-password" className="self-end text-xs text-primary">
          {t('forgot_password')}
        </Link>
        <button
          type="submit"
          disabled={loginMutation.isPending}
          className="rounded-lg bg-primary py-2.5 text-sm font-medium text-white disabled:opacity-60"
        >
          {t('login')}
        </button>
      </form>

      <div className="flex items-center gap-2 text-xs text-gray-400">
        <div className="h-px flex-1 bg-gray-200" />
        {t('or_continue_with')}
        <div className="h-px flex-1 bg-gray-200" />
      </div>

      <div className="flex flex-col gap-2">
        <button
          type="button"
          onClick={() => handleSocial('google')}
          disabled={socialLoading === 'google'}
          className="rounded-lg border border-gray-200 py-2 text-sm font-medium disabled:opacity-60"
        >
          Google
        </button>
        <button
          type="button"
          onClick={() => handleSocial('facebook')}
          disabled={socialLoading === 'facebook'}
          className="rounded-lg border border-gray-200 py-2 text-sm font-medium disabled:opacity-60"
        >
          Facebook
        </button>
        <button
          type="button"
          onClick={() => handleSocial('apple')}
          disabled={socialLoading === 'apple'}
          className="rounded-lg border border-gray-200 py-2 text-sm font-medium disabled:opacity-60"
        >
          Apple
        </button>
      </div>

      <button type="button" onClick={continueAsGuest} className="text-center text-xs text-gray-400 underline">
        {t('continue_as_guest')}
      </button>

      <p className="text-center text-sm text-gray-500">
        {t('dont_have_account')}{' '}
        <Link to="/auth/register" className="font-medium text-primary">
          {t('register')}
        </Link>
      </p>
    </div>
  );
}
