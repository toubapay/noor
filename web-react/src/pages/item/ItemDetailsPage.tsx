import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Minus, Plus, Heart } from 'lucide-react';
import * as api from '@/api/endpoints';
import { Loader } from '@/components/common/Loader';
import { EmptyState } from '@/components/common/EmptyState';
import { RatingStars } from '@/components/common/RatingStars';
import { calculateDiscountedPrice, formatCurrency } from '@/utils/currency';
import { useAppDispatch } from '@/store/hooks';
import { upsertCartItem } from '@/store/slices/cartSlice';
import { showApiError, toast } from '@/utils/toast';

export default function ItemDetailsPage() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const itemId = Number(id);
  const [quantity, setQuantity] = useState(1);
  const dispatch = useAppDispatch();

  const { data: item, isLoading } = useQuery({ queryKey: ['item', itemId], queryFn: () => api.getItemDetails(itemId) });

  const addMutation = useMutation({
    mutationFn: () => api.addToCart({ item_id: itemId, model_id: item?.store_id, quantity }),
    onSuccess: (data) => {
      if (data?.cart) dispatch(upsertCartItem(data.cart));
      toast.success(t('add_to_cart'));
    },
    onError: (err) => showApiError(err),
  });

  const wishlistMutation = useMutation({
    mutationFn: () => api.addToWishlist(itemId),
    onSuccess: () => toast.success('Added to favourites'),
    onError: (err) => showApiError(err),
  });

  if (isLoading) return <Loader label={t('loading')} />;
  if (!item) return <EmptyState message={t('no_data_found')} />;

  const finalPrice = calculateDiscountedPrice(item.price, item.discount, item.discount_type);

  return (
    <div className="flex flex-col gap-4 md:flex-row md:gap-8">
      <div className="aspect-square w-full overflow-hidden rounded-2xl bg-gray-100 md:w-1/2">
        {item.image_full_url && <img src={item.image_full_url} alt={item.name} className="h-full w-full object-cover" />}
      </div>
      <div className="flex flex-1 flex-col gap-3">
        <div className="flex items-start justify-between">
          <h1 className="text-xl font-bold text-gray-800">{item.name}</h1>
          <button type="button" onClick={() => wishlistMutation.mutate()} className="rounded-full p-2 hover:bg-gray-50">
            <Heart className="h-5 w-5 text-gray-500" />
          </button>
        </div>
        <RatingStars rating={item.avg_rating} count={item.rating_count} />
        {item.store_id && (
          <Link to={`/store/${item.store_id}`} className="text-xs text-primary">View store</Link>
        )}
        <p className="text-sm text-gray-500">{item.description}</p>
        <div className="flex items-baseline gap-2">
          <span className="text-xl font-bold text-primary">{formatCurrency(finalPrice)}</span>
          {finalPrice < item.price && (
            <span className="text-sm text-gray-400 line-through">{formatCurrency(item.price)}</span>
          )}
        </div>

        <div className="mt-auto flex items-center gap-4 pt-4">
          <div className="flex items-center gap-3 rounded-full border border-gray-200 px-3 py-1.5">
            <button type="button" onClick={() => setQuantity((q) => Math.max(1, q - 1))}>
              <Minus className="h-4 w-4" />
            </button>
            <span className="w-6 text-center text-sm">{quantity}</span>
            <button type="button" onClick={() => setQuantity((q) => q + 1)}>
              <Plus className="h-4 w-4" />
            </button>
          </div>
          <button
            type="button"
            onClick={() => addMutation.mutate()}
            disabled={addMutation.isPending}
            className="flex-1 rounded-full bg-primary py-2.5 text-sm font-medium text-white disabled:opacity-60"
          >
            {t('add_to_cart')}
          </button>
        </div>
      </div>
    </div>
  );
}
