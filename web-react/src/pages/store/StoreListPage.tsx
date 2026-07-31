import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import * as api from '@/api/endpoints';
import { Loader } from '@/components/common/Loader';
import { EmptyState } from '@/components/common/EmptyState';
import { StoreCard } from '@/components/common/StoreCard';

export default function StoreListPage() {
  const { t } = useTranslation();
  const { data, isLoading } = useQuery({
    queryKey: ['stores'],
    queryFn: () => api.getStores({ limit: 50, offset: 1 }),
  });

  if (isLoading) return <Loader label={t('loading')} />;
  if (!data?.stores?.length) return <EmptyState message={t('no_data_found')} />;

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
      {data.stores.map((store) => <StoreCard key={store.id} store={store} />)}
    </div>
  );
}
