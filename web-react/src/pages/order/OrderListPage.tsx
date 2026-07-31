import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import * as api from '@/api/endpoints';
import { Loader } from '@/components/common/Loader';
import { EmptyState } from '@/components/common/EmptyState';
import { formatCurrency } from '@/utils/currency';

export default function OrderListPage() {
  const { t } = useTranslation();
  const [tab, setTab] = useState<'running' | 'history'>('running');

  const running = useQuery({ queryKey: ['running-orders'], queryFn: () => api.getRunningOrders(1), enabled: tab === 'running' });
  const history = useQuery({ queryKey: ['order-history'], queryFn: () => api.getOrderHistory(1), enabled: tab === 'history' });

  const orders = (tab === 'running' ? running.data : history.data)?.orders;
  const isLoading = tab === 'running' ? running.isLoading : history.isLoading;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setTab('running')}
          className={`rounded-full px-4 py-1.5 text-sm ${tab === 'running' ? 'bg-primary text-white' : 'bg-white text-gray-600'}`}
        >
          {t('running_orders')}
        </button>
        <button
          type="button"
          onClick={() => setTab('history')}
          className={`rounded-full px-4 py-1.5 text-sm ${tab === 'history' ? 'bg-primary text-white' : 'bg-white text-gray-600'}`}
        >
          {t('order_history')}
        </button>
      </div>

      {isLoading ? (
        <Loader label={t('loading')} />
      ) : orders?.length ? (
        <div className="flex flex-col gap-3">
          {orders.map((order) => (
            <Link
              key={order.id}
              to={`/orders/${order.id}`}
              className="flex items-center justify-between rounded-xl border border-gray-100 bg-white p-4"
            >
              <div>
                <p className="text-sm font-medium text-gray-800">Order #{order.id}</p>
                <p className="text-xs capitalize text-gray-400">{order.order_status}</p>
              </div>
              <span className="text-sm font-semibold text-primary">{formatCurrency(order.order_amount)}</span>
            </Link>
          ))}
        </div>
      ) : (
        <EmptyState message={t('no_data_found')} />
      )}
    </div>
  );
}
