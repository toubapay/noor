import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { Search as SearchIcon } from 'lucide-react';
import * as api from '@/api/endpoints';
import { useDebounce } from '@/hooks/useDebounce';
import { useAddToCart } from '@/hooks/useAddToCart';
import { Loader } from '@/components/common/Loader';
import { EmptyState } from '@/components/common/EmptyState';
import { ProductCard } from '@/components/common/ProductCard';
import { StoreCard } from '@/components/common/StoreCard';

export default function SearchPage() {
  const { t } = useTranslation();
  const [query, setQuery] = useState('');
  const debounced = useDebounce(query, 400);
  const addToCart = useAddToCart();

  const { data, isFetching } = useQuery({
    queryKey: ['search', debounced],
    queryFn: () => api.searchItemsOrStores(debounced),
    enabled: debounced.trim().length > 1,
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2.5">
        <SearchIcon className="h-4 w-4 text-gray-400" />
        <input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t('search_hint')}
          className="flex-1 text-sm outline-none"
        />
      </div>

      {isFetching && <Loader />}

      {!isFetching && debounced.trim().length > 1 && !data?.items?.length && !data?.stores?.length && (
        <EmptyState message={t('no_data_found')} />
      )}

      {data?.stores?.length ? (
        <section>
          <h2 className="mb-2 text-sm font-semibold text-gray-700">Stores</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {data.stores.map((store: import('@/types').Store) => <StoreCard key={store.id} store={store} />)}
          </div>
        </section>
      ) : null}

      {data?.items?.length ? (
        <section>
          <h2 className="mb-2 text-sm font-semibold text-gray-700">Items</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {data.items.map((item: import('@/types').Item) => <ProductCard key={item.id} item={item} onAdd={addToCart} />)}
          </div>
        </section>
      ) : null}
    </div>
  );
}
