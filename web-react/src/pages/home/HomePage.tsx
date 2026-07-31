import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import * as api from '@/api/endpoints';
import { Loader } from '@/components/common/Loader';
import { CategoryCard } from '@/components/common/CategoryCard';
import { StoreCard } from '@/components/common/StoreCard';
import { ProductCard } from '@/components/common/ProductCard';
import { EmptyState } from '@/components/common/EmptyState';
import { useAddToCart } from '@/hooks/useAddToCart';

export default function HomePage() {
  const { t } = useTranslation();
  const addToCart = useAddToCart();

  const banners = useQuery({ queryKey: ['banners'], queryFn: api.getBanners });
  const categories = useQuery({ queryKey: ['categories'], queryFn: api.getCategories });
  const popularStores = useQuery({ queryKey: ['popular-stores'], queryFn: () => api.getPopularStores({ limit: 8, offset: 1 }) });
  const latestItems = useQuery({ queryKey: ['latest-items'], queryFn: () => api.getLatestItems({ limit: 12, offset: 1 }) });
  const discountedItems = useQuery({ queryKey: ['discounted-items'], queryFn: () => api.getDiscountedItems({ limit: 12, offset: 1 }) });

  if (categories.isLoading) return <Loader label={t('loading')} />;

  return (
    <div className="flex flex-col gap-8">
      {banners.data && banners.data.length > 0 && (
        <div className="scrollbar-hide flex gap-3 overflow-x-auto">
          {banners.data.map((banner) => (
            <div key={banner.id} className="h-40 w-full max-w-md shrink-0 overflow-hidden rounded-2xl bg-gray-100">
              {banner.image_full_url && (
                <img src={banner.image_full_url} alt={banner.title ?? ''} className="h-full w-full object-cover" />
              )}
            </div>
          ))}
        </div>
      )}

      <section>
        <h2 className="mb-3 text-base font-semibold text-gray-800">{t('categories')}</h2>
        {categories.data?.length ? (
          <div className="scrollbar-hide flex gap-4 overflow-x-auto pb-1">
            {categories.data.map((cat) => (
              <CategoryCard key={cat.id} category={cat} />
            ))}
          </div>
        ) : (
          <EmptyState message={t('no_data_found')} />
        )}
      </section>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-base font-semibold text-gray-800">{t('popular_stores')}</h2>
          <Link to="/stores" className="text-xs font-medium text-primary">{t('see_all')}</Link>
        </div>
        {popularStores.isLoading ? (
          <Loader />
        ) : popularStores.data?.length ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {popularStores.data.map((store) => (
              <StoreCard key={store.id} store={store} />
            ))}
          </div>
        ) : (
          <EmptyState message={t('no_data_found')} />
        )}
      </section>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-base font-semibold text-gray-800">{t('discounted_items')}</h2>
        </div>
        {discountedItems.isLoading ? (
          <Loader />
        ) : discountedItems.data?.items?.length ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {discountedItems.data.items.map((item) => (
              <ProductCard key={item.id} item={item} onAdd={addToCart} />
            ))}
          </div>
        ) : (
          <EmptyState message={t('no_data_found')} />
        )}
      </section>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-base font-semibold text-gray-800">{t('latest_items')}</h2>
        </div>
        {latestItems.isLoading ? (
          <Loader />
        ) : latestItems.data?.items?.length ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {latestItems.data.items.map((item) => (
              <ProductCard key={item.id} item={item} onAdd={addToCart} />
            ))}
          </div>
        ) : (
          <EmptyState message={t('no_data_found')} />
        )}
      </section>
    </div>
  );
}
