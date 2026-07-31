import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import * as api from '@/api/endpoints';
import { Loader } from '@/components/common/Loader';
import { EmptyState } from '@/components/common/EmptyState';
import { ProductCard } from '@/components/common/ProductCard';
import { useAddToCart } from '@/hooks/useAddToCart';

export default function FavouritePage() {
  const { t } = useTranslation();
  const addToCart = useAddToCart();
  const { data, isLoading } = useQuery({ queryKey: ['wishlist'], queryFn: api.getWishlist });

  if (isLoading) return <Loader label={t('loading')} />;
  if (!data?.length) return <EmptyState message={t('no_data_found')} />;

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-lg font-bold text-gray-800">{t('favourites')}</h1>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {data.filter((w) => w.item).map((w) => <ProductCard key={w.item_id} item={w.item!} onAdd={addToCart} />)}
      </div>
    </div>
  );
}
