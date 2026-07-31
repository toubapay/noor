import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery } from '@tanstack/react-query';
import * as api from '@/api/endpoints';
import { Loader } from '@/components/common/Loader';
import { EmptyState } from '@/components/common/EmptyState';
import { formatCurrency } from '@/utils/currency';
import { showApiError, toast } from '@/utils/toast';

export default function OrderDetailsPage() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const orderId = Number(id);

  const { data: order, isLoading, refetch } = useQuery({
    queryKey: ['order', orderId],
    queryFn: () => api.getOrderDetails(orderId),
  });

  const cancelMutation = useMutation({
    mutationFn: (reason: string) => api.cancelOrder(orderId, reason),
    onSuccess: () => {
      toast.success('Order canceled');
      refetch();
    },
    onError: (err) => showApiError(err),
  });

  if (isLoading) return <Loader label={t('loading')} />;
  if (!order) return <EmptyState message={t('no_data_found')} />;

  const cancellable = ['pending', 'confirmed'].includes(order.order_status);

  return (
    <div className="mx-auto flex max-w-lg flex-col gap-4">
      <h1 className="text-lg font-bold text-gray-800">{t('order_details')} #{order.id}</h1>
      <div className="rounded-xl border border-gray-100 bg-white p-4">
        <p className="text-sm capitalize text-gray-600">Status: {order.order_status}</p>
        <p className="text-sm capitalize text-gray-600">Payment: {order.payment_method} ({order.payment_status})</p>
        <p className="mt-2 text-base font-bold text-primary">{formatCurrency(order.order_amount)}</p>
      </div>

      {order.delivery_man && (
        <div className="rounded-xl border border-gray-100 bg-white p-4">
          <h2 className="mb-1 text-sm font-semibold text-gray-700">Delivery person</h2>
          <p className="text-sm text-gray-600">{order.delivery_man.f_name} {order.delivery_man.l_name}</p>
          <p className="text-xs text-gray-400">{order.delivery_man.phone}</p>
        </div>
      )}

      <div className="flex gap-3">
        <a
          href={`/orders/${order.id}/track`}
          className="flex-1 rounded-full border border-primary py-2.5 text-center text-sm font-medium text-primary"
        >
          {t('track_order')}
        </a>
        {cancellable && (
          <button
            type="button"
            onClick={() => cancelMutation.mutate('Changed my mind')}
            disabled={cancelMutation.isPending}
            className="flex-1 rounded-full border border-red-400 py-2.5 text-sm font-medium text-red-500 disabled:opacity-60"
          >
            {t('cancel_order')}
          </button>
        )}
      </div>
    </div>
  );
}
