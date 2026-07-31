import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import * as api from '@/api/endpoints';
import { Loader } from '@/components/common/Loader';
import { EmptyState } from '@/components/common/EmptyState';
import { ProductCard } from '@/components/common/ProductCard';
import { RatingStars } from '@/components/common/RatingStars';
import { useAddToCart } from '@/hooks/useAddToCart';

export default function StoreDetailsPage() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const storeId = Number(id);
  const addToCart = useAddToCart();

  const store = useQuery({ queryKey: ['store', storeId], queryFn: () => api.getStoreDetails(storeId) });
  const items = useQuery({
    queryKey: ['store-items', storeId],
    queryFn: () => api.getLatestItems({ store_id: storeId, limit: 30, offset: 1 }),
  });

  if (store.isLoading) return <Loader label={t('loading')} />;
  if (!store.data) return <EmptyState message={t('no_data_found')} />;

  return (
    <div className="flex flex-col gap-4">
      <div className="overflow-hidden rounded-2xl bg-gray-100">
        {store.data.cover_photo_full_url && (
          <img src={store.data.cover_photo_full_url} alt={store.data.name} className="h-48 w-full object-cover" />
        )}
      </div>
      <div className="flex items-center gap-3">
        <div className="h-16 w-16 overflow-hidden rounded-full border bg-white">
          {store.data.logo_full_url && <img src={store.data.logo_full_url} alt="" className="h-full w-full object-cover" />}
        </div>
        <div>
          <h1 className="text-lg font-bold text-gray-800">{store.data.name}</h1>
          <RatingStars rating={store.data.avg_rating} count={store.data.rating_count} />
          <p className="text-xs text-gray-400">{store.data.address}</p>
        </div>
      </div>

      <h2 className="text-base font-semibold text-gray-800">Menu</h2>
      {items.isLoading ? (
        <Loader />
      ) : items.data?.items?.length ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {items.data.items.map((item) => <ProductCard key={item.id} item={item} onAdd={addToCart} />)}
        </div>
      ) : (
        <EmptyState message={t('no_data_found')} />
      )}
    </div>
  );
}
