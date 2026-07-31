import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import * as api from '@/api/endpoints';
import { Loader } from '@/components/common/Loader';
import { EmptyState } from '@/components/common/EmptyState';

export default function ChatListPage() {
  const { t } = useTranslation();
  const { data, isLoading } = useQuery({ queryKey: ['conversations'], queryFn: api.getConversations });

  if (isLoading) return <Loader label={t('loading')} />;
  if (!data?.length) return <EmptyState message={t('no_data_found')} />;

  return (
    <div className="mx-auto flex max-w-lg flex-col gap-2">
      <h1 className="mb-2 text-lg font-bold text-gray-800">{t('chat')}</h1>
      {data.map((conv) => (
        <Link key={conv.id} to={`/chat/${conv.id}`} className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white p-3">
          <div className="h-10 w-10 overflow-hidden rounded-full bg-gray-100">
            {conv.store?.logo_full_url && <img src={conv.store.logo_full_url} alt="" className="h-full w-full object-cover" />}
          </div>
          <p className="text-sm font-medium text-gray-800">{conv.store?.name ?? `Order #${conv.order_id}`}</p>
        </Link>
      ))}
    </div>
  );
}
