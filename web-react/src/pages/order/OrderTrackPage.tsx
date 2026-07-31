import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import * as api from '@/api/endpoints';
import { Loader } from '@/components/common/Loader';
import { EmptyState } from '@/components/common/EmptyState';
import { OrderStatus } from '@/config/constants';

const steps: string[] = [OrderStatus.pending, OrderStatus.confirmed, OrderStatus.processing, OrderStatus.handover, OrderStatus.delivered];

export default function OrderTrackPage() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();

  const { data: order, isLoading } = useQuery({
    queryKey: ['order-track', id],
    queryFn: () => api.trackOrder(id ?? ''),
    refetchInterval: 15_000,
  });

  if (isLoading) return <Loader label={t('loading')} />;
  if (!order) return <EmptyState message={t('no_data_found')} />;

  const currentIndex = steps.indexOf(order.order_status);

  return (
    <div className="mx-auto flex max-w-lg flex-col gap-6">
      <h1 className="text-lg font-bold text-gray-800">{t('track_order')} #{order.id}</h1>
      <div className="flex flex-col gap-4">
        {steps.map((step, idx) => (
          <div key={step} className="flex items-center gap-3">
            <div
              className={`h-3 w-3 rounded-full ${idx <= currentIndex ? 'bg-primary' : 'bg-gray-200'}`}
            />
            <span className={`text-sm capitalize ${idx <= currentIndex ? 'text-gray-800' : 'text-gray-400'}`}>
              {step.replace('_', ' ')}
            </span>
          </div>
        ))}
      </div>
      {order.delivery_man?.location && (
        <p className="text-xs text-gray-400">
          Delivery person last seen at {order.delivery_man.location.latitude}, {order.delivery_man.location.longitude}
        </p>
      )}
    </div>
  );
}
