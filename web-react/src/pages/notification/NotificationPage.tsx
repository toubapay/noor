import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import * as api from '@/api/endpoints';
import { Loader } from '@/components/common/Loader';
import { EmptyState } from '@/components/common/EmptyState';

export default function NotificationPage() {
  const { t } = useTranslation();
  const { data, isLoading } = useQuery({ queryKey: ['notifications'], queryFn: api.getNotifications });

  if (isLoading) return <Loader label={t('loading')} />;
  if (!data?.length) return <EmptyState message={t('no_data_found')} />;

  return (
    <div className="mx-auto flex max-w-lg flex-col gap-2">
      <h1 className="mb-2 text-lg font-bold text-gray-800">{t('notifications')}</h1>
      {data.map((n) => (
        <div key={n.id} className="flex gap-3 rounded-xl border border-gray-100 bg-white p-3">
          {n.image_full_url && <img src={n.image_full_url} alt="" className="h-12 w-12 rounded-lg object-cover" />}
          <div>
            <p className="text-sm font-medium text-gray-800">{n.title}</p>
            <p className="text-xs text-gray-500">{n.description}</p>
            <p className="mt-1 text-[11px] text-gray-300">{new Date(n.created_at).toLocaleString()}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
