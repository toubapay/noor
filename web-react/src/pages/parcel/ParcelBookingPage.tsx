import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery } from '@tanstack/react-query';
import * as api from '@/api/endpoints';
import { Loader } from '@/components/common/Loader';
import { showApiError, toast } from '@/utils/toast';

interface FormValues {
  receiverName: string;
  receiverPhone: string;
  receiverAddress: string;
  parcelCategoryId: string;
}

export default function ParcelBookingPage() {
  const { t } = useTranslation();
  const { data: categories, isLoading } = useQuery({ queryKey: ['parcel-categories'], queryFn: api.getParcelCategories });
  const { register, handleSubmit } = useForm<FormValues>();

  const mutation = useMutation({
    mutationFn: (values: FormValues) =>
      api.placeOrder({
        order_type: 'parcel',
        receiver_details: {
          f_name: values.receiverName,
          phone: values.receiverPhone,
          address: values.receiverAddress,
        },
        parcel_category_id: Number(values.parcelCategoryId),
      }),
    onSuccess: () => toast.success('Parcel order placed'),
    onError: (err) => showApiError(err, 'Could not book parcel'),
  });

  if (isLoading) return <Loader label={t('loading')} />;

  return (
    <form onSubmit={handleSubmit((v) => mutation.mutate(v))} className="mx-auto flex max-w-lg flex-col gap-3">
      <h1 className="text-lg font-bold text-gray-800">{t('parcel')}</h1>
      <select {...register('parcelCategoryId', { required: true })} className="rounded-lg border border-gray-200 px-3 py-2.5 text-sm">
        <option value="">Parcel category</option>
        {categories?.map((cat) => (
          <option key={cat.id} value={cat.id}>{cat.parcel_category_name}</option>
        ))}
      </select>
      <input placeholder="Receiver name" className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm" {...register('receiverName', { required: true })} />
      <input placeholder="Receiver phone" className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm" {...register('receiverPhone', { required: true })} />
      <input placeholder="Receiver address" className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm" {...register('receiverAddress', { required: true })} />
      <button type="submit" disabled={mutation.isPending} className="rounded-full bg-primary py-2.5 text-sm font-semibold text-white disabled:opacity-60">
        {t('place_order')}
      </button>
    </form>
  );
}
