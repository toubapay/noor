import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import * as api from '@/api/endpoints';
import { Loader } from '@/components/common/Loader';
import { EmptyState } from '@/components/common/EmptyState';
import { ProductCard } from '@/components/common/ProductCard';
import { useAddToCart } from '@/hooks/useAddToCart';

export default function BrandDetailsPage() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const addToCart = useAddToCart();

  const { data, isLoading } = useQuery({
    queryKey: ['brand-items', id],
    queryFn: () => api.getBrandItems(Number(id), { limit: 30, offset: 1 }),
  });

  if (isLoading) return <Loader label={t('loading')} />;
  if (!data?.items?.length) return <EmptyState message={t('no_data_found')} />;

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
      {data.items.map((item: import('@/types').Item) => <ProductCard key={item.id} item={item} onAdd={addToCart} />)}
    </div>
  );
}
