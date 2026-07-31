import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import * as api from '@/api/endpoints';
import { Loader } from '@/components/common/Loader';
import { EmptyState } from '@/components/common/EmptyState';
import { ProductCard } from '@/components/common/ProductCard';
import { useAddToCart } from '@/hooks/useAddToCart';

export default function FlashSalePage() {
  const { t } = useTranslation();
  const { id } = useParams<{ id?: string }>();
  const addToCart = useAddToCart();

  const sales = useQuery({ queryKey: ['flash-sales'], queryFn: api.getFlashSales, enabled: !id });
  const saleItems = useQuery({
    queryKey: ['flash-sale-items', id],
    queryFn: () => api.getFlashSaleItems(Number(id)),
    enabled: Boolean(id),
  });

  if (id) {
    if (saleItems.isLoading) return <Loader label={t('loading')} />;
    if (!saleItems.data?.length) return <EmptyState message={t('no_data_found')} />;
    return (
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {saleItems.data.map((item) => <ProductCard key={item.id} item={item} onAdd={addToCart} />)}
      </div>
    );
  }

  if (sales.isLoading) return <Loader label={t('loading')} />;
  if (!sales.data?.length) return <EmptyState message={t('no_data_found')} />;

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-lg font-bold text-gray-800">{t('flash_sale')}</h1>
      <div className="grid gap-3 sm:grid-cols-2">
        {sales.data.map((sale) => (
          <a key={sale.id} href={`/flash-sale/${sale.id}`} className="overflow-hidden rounded-xl bg-gray-100">
            {sale.banner_full_url && <img src={sale.banner_full_url} alt={sale.title} className="h-32 w-full object-cover" />}
            <p className="p-2 text-sm font-medium text-gray-700">{sale.title}</p>
          </a>
        ))}
      </div>
    </div>
  );
}
