import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import * as api from '@/api/endpoints';
import { Loader } from '@/components/common/Loader';
import { EmptyState } from '@/components/common/EmptyState';
import { ProductCard } from '@/components/common/ProductCard';
import { StoreCard } from '@/components/common/StoreCard';
import { useAddToCart } from '@/hooks/useAddToCart';

export default function CategoryPage() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const categoryId = Number(id);
  const addToCart = useAddToCart();
  const [tab, setTab] = useState<'items' | 'stores'>('items');

  const items = useQuery({
    queryKey: ['category-items', categoryId],
    queryFn: () => api.getCategoryItems(categoryId, { limit: 20, offset: 1 }),
    enabled: tab === 'items',
  });
  const stores = useQuery({
    queryKey: ['category-stores', categoryId],
    queryFn: () => api.getCategoryStores(categoryId, { limit: 20, offset: 1 }),
    enabled: tab === 'stores',
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setTab('items')}
          className={`rounded-full px-4 py-1.5 text-sm ${tab === 'items' ? 'bg-primary text-white' : 'bg-white text-gray-600'}`}
        >
          Items
        </button>
        <button
          type="button"
          onClick={() => setTab('stores')}
          className={`rounded-full px-4 py-1.5 text-sm ${tab === 'stores' ? 'bg-primary text-white' : 'bg-white text-gray-600'}`}
        >
          Stores
        </button>
      </div>

      {tab === 'items' && (
        items.isLoading ? <Loader label={t('loading')} /> :
        items.data?.items?.length ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {items.data.items.map((item: import('@/types').Item) => <ProductCard key={item.id} item={item} onAdd={addToCart} />)}
          </div>
        ) : <EmptyState message={t('no_data_found')} />
      )}

      {tab === 'stores' && (
        stores.isLoading ? <Loader label={t('loading')} /> :
        stores.data?.length ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {stores.data.map((store: import('@/types').Store) => <StoreCard key={store.id} store={store} />)}
          </div>
        ) : <EmptyState message={t('no_data_found')} />
      )}
    </div>
  );
}
