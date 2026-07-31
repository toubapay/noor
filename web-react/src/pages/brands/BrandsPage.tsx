import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import * as api from '@/api/endpoints';
import { Loader } from '@/components/common/Loader';
import { EmptyState } from '@/components/common/EmptyState';

export default function BrandsPage() {
  const { t } = useTranslation();
  const { data, isLoading } = useQuery({ queryKey: ['brands'], queryFn: api.getBrands });

  if (isLoading) return <Loader label={t('loading')} />;
  if (!data?.length) return <EmptyState message={t('no_data_found')} />;

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-lg font-bold text-gray-800">{t('brands')}</h1>
      <div className="grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-6">
        {data.map((brand) => (
          <Link key={brand.id} to={`/brands/${brand.id}`} className="flex flex-col items-center gap-2 text-center">
            <div className="h-16 w-16 overflow-hidden rounded-full border bg-white">
              {brand.image_full_url && <img src={brand.image_full_url} alt={brand.name} className="h-full w-full object-contain" />}
            </div>
            <span className="line-clamp-1 text-xs text-gray-600">{brand.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
