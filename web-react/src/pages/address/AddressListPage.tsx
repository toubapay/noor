import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Trash2, Plus, MapPin } from 'lucide-react';
import * as api from '@/api/endpoints';
import { Loader } from '@/components/common/Loader';
import { EmptyState } from '@/components/common/EmptyState';
import { useAppDispatch } from '@/store/hooks';
import { setSelectedAddress } from '@/store/slices/addressSlice';
import { useGeolocation } from '@/hooks/useGeolocation';
import { showApiError, toast } from '@/utils/toast';

interface FormValues {
  addressType: string;
  address: string;
  road?: string;
  house?: string;
}

export default function AddressListPage() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const { coords, locate } = useGeolocation();
  const { register, handleSubmit, reset } = useForm<FormValues>();

  const { data: addresses, isLoading } = useQuery({ queryKey: ['addresses'], queryFn: api.getAddresses });

  const addMutation = useMutation({
    mutationFn: (values: FormValues) =>
      api.addAddress({
        address_type: values.addressType,
        address: values.address,
        road: values.road,
        house: values.house,
        latitude: String(coords?.latitude ?? 0),
        longitude: String(coords?.longitude ?? 0),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
      toast.success('Address added');
      reset();
      setShowForm(false);
    },
    onError: (err) => showApiError(err),
  });

  const removeMutation = useMutation({
    mutationFn: (id: number) => api.removeAddress(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['addresses'] }),
    onError: (err) => showApiError(err),
  });

  return (
    <div className="mx-auto flex max-w-lg flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-bold text-gray-800">{t('delivery_address')}</h1>
        <button type="button" onClick={() => setShowForm((s) => !s)} className="flex items-center gap-1 text-sm text-primary">
          <Plus className="h-4 w-4" /> {t('add_new_address')}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit((v) => addMutation.mutate(v))}
          className="flex flex-col gap-2 rounded-xl border border-gray-100 bg-white p-4"
        >
          <select {...register('addressType', { required: true })} className="rounded-lg border border-gray-200 px-3 py-2 text-sm">
            <option value="home">Home</option>
            <option value="office">Office</option>
            <option value="others">Other</option>
          </select>
          <input
            placeholder={t('delivery_address')}
            className="rounded-lg border border-gray-200 px-3 py-2 text-sm"
            {...register('address', { required: true })}
          />
          <div className="flex gap-2">
            <input placeholder="Road" className="w-1/2 rounded-lg border border-gray-200 px-3 py-2 text-sm" {...register('road')} />
            <input placeholder="House" className="w-1/2 rounded-lg border border-gray-200 px-3 py-2 text-sm" {...register('house')} />
          </div>
          <button type="button" onClick={locate} className="flex items-center gap-1 text-xs text-primary">
            <MapPin className="h-3.5 w-3.5" /> Use current location {coords && '✓'}
          </button>
          <button
            type="submit"
            disabled={addMutation.isPending}
            className="rounded-lg bg-primary py-2 text-sm font-medium text-white disabled:opacity-60"
          >
            Save
          </button>
        </form>
      )}

      {isLoading ? (
        <Loader label={t('loading')} />
      ) : addresses?.length ? (
        <div className="flex flex-col gap-2">
          {addresses.map((addr) => (
            <div key={addr.id} className="flex items-center justify-between rounded-xl border border-gray-100 bg-white p-3">
              <button type="button" onClick={() => dispatch(setSelectedAddress(addr))} className="flex-1 text-left">
                <p className="text-sm font-medium capitalize text-gray-800">{addr.address_type}</p>
                <p className="text-xs text-gray-500">{addr.address}</p>
              </button>
              <button type="button" onClick={() => removeMutation.mutate(addr.id)} className="p-1 text-gray-400">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState message={t('no_data_found')} />
      )}
    </div>
  );
}
