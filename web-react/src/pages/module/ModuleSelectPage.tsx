import { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import * as api from '@/api/endpoints';
import { Loader } from '@/components/common/Loader';
import { EmptyState } from '@/components/common/EmptyState';
import { SectionHeader } from '@/components/common/SectionHeader';
import { BannerCarousel } from '@/components/common/BannerCarousel';
import { useAppDispatch } from '@/store/hooks';
import { useAuth } from '@/hooks/useAuth';
import { setModule } from '@/store/slices/moduleSlice';
import { Modules } from '@/config/constants';
import { calculateDiscountedPrice, formatCurrency } from '@/utils/currency';
import type { Item, Module } from '@/types';

export default function ModuleSelectPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { isAuthenticated } = useAuth();
  const { data: modules, isLoading } = useQuery({ queryKey: ['modules'], queryFn: api.getModules });
  const banners = useQuery({ queryKey: ['banners'], queryFn: api.getBanners });
  const brands = useQuery({ queryKey: ['brands'], queryFn: api.getBrands });
  // Personalized greeting only for logged-in users - the global axios
  // interceptor hard-redirects to /auth/login on any 401, so this must
  // never fire for guests (this page is reachable without logging in).
  const profile = useQuery({ queryKey: ['profile'], queryFn: api.getCustomerInfo, enabled: isAuthenticated });

  const shopModule = useMemo(() => modules?.find((m) => m.module_type === Modules.ecommerce), [modules]);

  const latestProducts = useQuery({
    queryKey: ['shop-latest-products', shopModule?.id],
    queryFn: () => api.getShopLatestProducts(shopModule!.id),
    enabled: Boolean(shopModule),
  });

  const choose = (mod: Module) => {
    dispatch(setModule(mod));
    navigate('/');
  };

  // Selects the item's own module before navigating - the item itself
  // belongs to the Shop module regardless of which module (if any) the
  // user ends up choosing next, mirroring the same pattern used for
  // cross-module taps elsewhere (e.g. ItemWidget's isFeatured branch in
  // the Flutter app this mirrors).
  const openProduct = (item: Item) => {
    if (shopModule) dispatch(setModule(shopModule));
    navigate(`/item/${item.id}`);
  };

  if (isLoading) return <Loader label={t('loading')} />;
  if (!modules?.length) return <EmptyState message={t('no_data_found')} />;

  return (
    <div className="-mx-4 -my-6 sm:mx-0 sm:my-0">
      <div className="bg-primary px-6 pb-10 pt-8">
        <h1 className="mb-6 text-center text-sm font-semibold text-white/90">{t('select_module')}</h1>
        <div className="mx-auto flex max-w-lg flex-wrap justify-center gap-x-1 gap-y-8">
          {modules.map((mod) => (
            <button key={mod.id} type="button" onClick={() => choose(mod)} className="flex w-24 flex-col items-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/30">
                <div className="flex h-[62px] w-[62px] items-center justify-center rounded-full bg-white shadow-md">
                  {mod.icon || mod.thumbnail ? (
                    <img src={mod.icon || mod.thumbnail} alt="" className="h-9 w-9 object-contain" />
                  ) : (
                    <div className="h-9 w-9 rounded-full bg-primary/10" />
                  )}
                </div>
              </div>
              <span className="-mt-3 rounded-full bg-white px-3 py-1 text-xs font-semibold text-primary shadow">
                {t(mod.module_type, { defaultValue: mod.module_name })}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="relative -mt-6 rounded-t-3xl bg-gray-50 px-4 pb-8 pt-5">
        {banners.data && banners.data.length > 0 && <BannerCarousel banners={banners.data} />}

        {brands.data && brands.data.length > 0 && (
          <section className="mt-6">
            <p className="mb-3 px-0.5 text-sm text-gray-500">
              {profile.data?.f_name && <span className="font-semibold text-gray-800">{profile.data.f_name}, </span>}
              {t('save_on_top_brands')}
            </p>
            <div className="scrollbar-hide flex gap-3 overflow-x-auto pb-1">
              {brands.data.slice(0, 8).map((brand) => (
                <Link
                  key={brand.id}
                  to={`/brands/${brand.id}`}
                  className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-gray-100 bg-white p-2 shadow-sm"
                >
                  {brand.image_full_url && (
                    <img src={brand.image_full_url} alt={brand.name} className="h-full w-full object-contain" />
                  )}
                </Link>
              ))}
            </div>
          </section>
        )}

        {shopModule && latestProducts.data?.items && latestProducts.data.items.length > 0 && (
          <section className="mt-6">
            <SectionHeader title={t('latest_products')} />
            <div className="scrollbar-hide flex gap-3 overflow-x-auto pb-1">
              {latestProducts.data.items.map((item) => {
                const finalPrice = calculateDiscountedPrice(item.price, item.discount, item.discount_type);
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => openProduct(item)}
                    className="w-36 shrink-0 overflow-hidden rounded-xl border border-gray-100 bg-white text-left shadow-sm"
                  >
                    <div className="h-24 w-full bg-gray-100">
                      {item.image_full_url && (
                        <img src={item.image_full_url} alt={item.name} className="h-full w-full object-cover" />
                      )}
                    </div>
                    <div className="p-2">
                      <p className="line-clamp-1 text-xs font-medium text-gray-800">{item.name}</p>
                      <p className="text-xs font-semibold text-primary">{formatCurrency(finalPrice)}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
