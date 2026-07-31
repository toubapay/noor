import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery } from '@tanstack/react-query';
import * as api from '@/api/endpoints';
import { Loader } from '@/components/common/Loader';
import { showApiError, toast } from '@/utils/toast';

interface FormValues {
  fName: string;
  lName: string;
  phone: string;
}

export default function EditProfilePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data: user, isLoading } = useQuery({ queryKey: ['profile'], queryFn: api.getCustomerInfo });
  const { register, handleSubmit, reset } = useForm<FormValues>();

  useEffect(() => {
    if (user) reset({ fName: user.f_name, lName: user.l_name, phone: user.phone });
  }, [user, reset]);

  const mutation = useMutation({
    mutationFn: (values: FormValues) => {
      const formData = new FormData();
      formData.append('f_name', values.fName);
      formData.append('l_name', values.lName);
      formData.append('phone', values.phone);
      return api.updateProfile(formData);
    },
    onSuccess: () => {
      toast.success('Profile updated');
      navigate('/profile');
    },
    onError: (err) => showApiError(err),
  });

  if (isLoading) return <Loader label={t('loading')} />;

  return (
    <form onSubmit={handleSubmit((v) => mutation.mutate(v))} className="mx-auto flex max-w-md flex-col gap-3">
      <h1 className="text-lg font-bold text-gray-800">{t('edit_profile')}</h1>
      <input placeholder={t('first_name')} className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm" {...register('fName', { required: true })} />
      <input placeholder={t('last_name')} className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm" {...register('lName', { required: true })} />
      <input placeholder={t('phone')} className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm" {...register('phone', { required: true })} />
      <button type="submit" disabled={mutation.isPending} className="rounded-lg bg-primary py-2.5 text-sm font-medium text-white disabled:opacity-60">
        Save
      </button>
    </form>
  );
}
